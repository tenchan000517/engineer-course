/**
 * Premiere Pro ExtendScript: リール素材自動配置
 *
 * 対応リール形式:
 * - ランキングリール（従来機能）
 * - 解説リール（2026-02-03追加）
 *
 * 使い方:
 * 1. Premiere Proでプロジェクトを開く
 * 2. シーケンスをアクティブにする
 * 3. VSCodeからF5で実行（ExtendScript Debugger使用）
 * 4. ファイル選択ダイアログで placement.json を選択
 *
 * 前提条件:
 * - 素材ファイルが指定パスに存在する
 *
 * 対応type一覧:
 * [共通]
 * - shared: 共有素材配置
 * - avatar_still: アバター静止画
 * - avatar_video: アバター動画（time/duration指定、ループ対応）
 * - narration: ナレーション音声（連続配置、time指定対応）
 *
 * [ランキングリール]
 * - ranking: ランキングアイコン（スケール・座標設定）
 * - prompt_screenshot: プロンプトスクリーンショット
 *
 * [解説リール]
 * - hook_video: フック動画
 * - ui: UI静止画
 * - completion: 完成動画
 * - trigger: トリガーワード静止画
 * - se: 効果音
 */

(function() {
    // ========== 設定 ==========

    // placement.jsonをファイル選択ダイアログで選択
    var jsonFile = File.openDialog(
        "placement.json を選択してください",
        "JSON Files:*.json",
        false
    );

    if (!jsonFile) {
        alert("キャンセルされました");
        return;
    }

    var jsonPath = jsonFile.fsName;

    // トラック番号マッピング（0始まり）
    // 新トラック構造（2026-01-26更新）
    // V1: アバター動画, V2: 調整レイヤー, V3: アバター静止画
    // V4: ランキングボード, V5: 論外, V6-V9: No.4〜No.1
    // V10-V12: プロンプト・手順, V13: タイトル背景, V14: 字幕背景
    var VIDEO_TRACK_MAP = {
        "V1": 0,
        "V2": 1,
        "V3": 2,
        "V4": 3,
        "V5": 4,
        "V6": 5,
        "V7": 6,
        "V8": 7,
        "V9": 8,
        "V10": 9,
        "V11": 10,
        "V12": 11,
        "V13": 12,
        "V14": 13
    };

    // オーディオトラック
    var AUDIO_TRACK_MAP = {
        "A1": 0,
        "A2": 1,
        "A3": 2,
        "A4": 3
    };

    // フレームサイズ（正規化用）
    var FRAME_WIDTH = 1080;
    var FRAME_HEIGHT = 1920;

    // ========== メイン処理 ==========

    function main() {
        // アクティブシーケンスを取得
        var seq = app.project.activeSequence;
        if (!seq) {
            alert("エラー: シーケンスを開いてから実行してください");
            return;
        }

        // JSONファイルを読み込み
        var placements = loadJSON(jsonPath);
        if (!placements) {
            alert("エラー: placement.json が見つかりません\nパス: " + jsonPath);
            return;
        }

        var successCount = 0;
        var errorCount = 0;
        var errors = [];

        // 各配置を処理
        for (var i = 0; i < placements.length; i++) {
            var p = placements[i];
            var result;

            // typeによって処理を分岐
            switch (p.type) {
                // 共通type
                case 'shared':
                case 'avatar_still':
                    result = placeMedia(seq, p);
                    break;
                case 'narration':
                    result = placeNarration(seq, p);
                    break;
                case 'avatar_video':
                    result = placeAvatarVideo(seq, p);
                    break;

                // ランキングリール用type
                case 'ranking':
                    result = placeRankingIcon(seq, p);
                    break;
                case 'prompt_screenshot':
                    result = placeRankingIcon(seq, p);
                    break;

                // 解説リール用type
                case 'hook_video':
                    result = placeHookVideo(seq, p);
                    break;
                case 'hook_audio':
                    result = placeHookAudio(seq, p);
                    break;
                case 'ui':
                case 'completion':
                case 'completion_preview':
                case 'trigger':
                case 'tool_name':
                case 'prompt':
                    result = placeMedia(seq, p);
                    break;
                case 'se':
                    result = placeSoundEffect(seq, p);
                    break;

                default:
                    // 旧形式（typeなし）の場合はランキングアイコンとして処理
                    result = placeRankingIcon(seq, p);
            }

            if (result.success) {
                successCount++;
            } else {
                errorCount++;
                errors.push((p.name || p.tool || "不明") + ": " + result.error);
            }
        }

        // ========== A1基準で終了時間を調整 ==========
        // ナレーション（A1）の実際の終了時間を取得し、他の要素をそれに合わせる
        var actualEndTime = getTrackEndTime(seq.audioTracks[0]);  // A1
        $.writeln("[メイン] A1の実際の終了時間: " + actualEndTime + "秒");

        if (actualEndTime > 0) {
            // 終了時間を合わせるべき要素を延長
            extendTracksToEndTime(seq, actualEndTime);
        }

        // 結果を表示
        var message = "完了!\n";
        message += "成功: " + successCount + " 件\n";
        message += "失敗: " + errorCount + " 件";
        if (errors.length > 0 && errors.length <= 5) {
            message += "\n\nエラー詳細:\n" + errors.join("\n");
        } else if (errors.length > 5) {
            message += "\n\nエラー詳細（一部）:\n" + errors.slice(0, 5).join("\n") + "\n...他" + (errors.length - 5) + "件";
        }
        alert(message);
    }

    // ========== ヘルパー関数 ==========

    /**
     * JSONファイルを読み込む
     */
    function loadJSON(path) {
        var file = new File(path);
        if (!file.exists) {
            return null;
        }

        file.open("r");
        var content = file.read();
        file.close();

        try {
            return eval("(" + content + ")");
        } catch (e) {
            alert("JSONパースエラー: " + e.message);
            return null;
        }
    }

    /**
     * 共有素材・アバター静止画を配置
     */
    function placeMedia(seq, placement) {
        try {
            var mediaPath = placement.path;
            var timeInSeconds = placement.time;
            var trackName = placement.track;
            var duration = placement.duration;
            var muteAudio = placement.mute_audio;

            // ファイル存在確認
            var mediaFile = new File(mediaPath);
            if (!mediaFile.exists) {
                return { success: false, error: "ファイルが見つかりません: " + mediaPath };
            }

            // トラック判定（ビデオ or オーディオ）
            var isAudio = trackName.charAt(0) === 'A';
            var trackIndex = isAudio ? AUDIO_TRACK_MAP[trackName] : VIDEO_TRACK_MAP[trackName];

            if (trackIndex === undefined) {
                return { success: false, error: "不明なトラック: " + trackName };
            }

            // メディアをプロジェクトにインポート
            var importResult = app.project.importFiles(
                [mediaPath],
                true,
                app.project.rootItem,
                false
            );

            if (!importResult) {
                return { success: false, error: "インポート失敗" };
            }

            // インポートしたアイテムを検索
            var projectItem = findProjectItemByName(
                app.project.rootItem,
                mediaFile.name
            );

            if (!projectItem) {
                return { success: false, error: "インポート後のアイテムが見つかりません" };
            }

            // タイムラインに配置
            var track = isAudio ? seq.audioTracks[trackIndex] : seq.videoTracks[trackIndex];
            if (!track) {
                return { success: false, error: "トラックが存在しません: " + trackName };
            }

            // クリップを挿入
            track.overwriteClip(projectItem, timeInSeconds);

            // 動画の場合、音声がA1に自動配置されるので削除（mute_audio指定時）
            if (!isAudio && muteAudio) {
                removeAudioClipAtTime(seq, timeInSeconds);
            }

            // 配置したクリップを取得
            var clip = findClipAtTime(track, timeInSeconds);

            if (clip) {
                // 長さを設定
                if (duration && duration > 0) {
                    var endTime = timeInSeconds + duration;
                    $.writeln("[placeMedia] " + placement.name + ": duration=" + duration + "秒, endTime=" + endTime + "秒");
                    setClipEndTime(clip, endTime);
                }

                // ボリューム設定（オーディオのみ）
                if (isAudio && placement.volume !== undefined) {
                    $.writeln("[placeMedia] " + placement.name + ": volume=" + placement.volume + "dB");
                    setClipVolume(clip, placement.volume);
                }

                // スケール・位置設定（ビデオのみ）
                if (!isAudio && (placement.scale !== undefined || placement.x !== undefined || placement.y !== undefined)) {
                    $.writeln("[placeMedia] " + placement.name + ": scale=" + placement.scale + ", x=" + placement.x + ", y=" + placement.y);
                    setClipMotion(clip, placement.scale, placement.x, placement.y);
                }

                // クロップ設定（ビデオのみ）
                if (!isAudio && (placement.crop_left !== undefined || placement.crop_right !== undefined ||
                    placement.crop_top !== undefined || placement.crop_bottom !== undefined)) {
                    $.writeln("[placeMedia] " + placement.name + ": crop L=" + placement.crop_left + ", R=" + placement.crop_right + ", T=" + placement.crop_top + ", B=" + placement.crop_bottom);
                    setClipCrop(clip, placement.crop_left, placement.crop_right, placement.crop_top, placement.crop_bottom);
                }
            }

            return { success: true };

        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * ランキングアイコンを配置（スケール・座標設定あり）
     */
    function placeRankingIcon(seq, placement) {
        try {
            var imagePath = placement.path || placement.image;
            var timeInSeconds = placement.time;
            var trackName = placement.track;
            var duration = placement.duration;
            var scale = placement.scale;
            var xPos = placement.x;
            var yPos = placement.y;

            // ファイル存在確認
            var imageFile = new File(imagePath);
            if (!imageFile.exists) {
                return { success: false, error: "ファイルが見つかりません: " + imagePath };
            }

            // トラック番号を取得
            var trackIndex = VIDEO_TRACK_MAP[trackName];
            if (trackIndex === undefined) {
                return { success: false, error: "不明なトラック: " + trackName };
            }

            // 画像をプロジェクトにインポート
            var importResult = app.project.importFiles(
                [imagePath],
                true,
                app.project.rootItem,
                false
            );

            if (!importResult) {
                return { success: false, error: "インポート失敗" };
            }

            // インポートしたアイテムを検索
            var projectItem = findProjectItemByName(
                app.project.rootItem,
                imageFile.name
            );

            if (!projectItem) {
                return { success: false, error: "インポート後のアイテムが見つかりません" };
            }

            // タイムラインに配置
            var videoTrack = seq.videoTracks[trackIndex];
            if (!videoTrack) {
                return { success: false, error: "トラックが存在しません: " + trackName };
            }

            // クリップを挿入
            videoTrack.overwriteClip(projectItem, timeInSeconds);

            // 配置したクリップを取得
            var clip = findClipAtTime(videoTrack, timeInSeconds);

            if (clip) {
                // 長さを設定
                if (duration && duration > 0) {
                    var endTime = timeInSeconds + duration;
                    $.writeln("[placeRankingIcon] " + (placement.name || placement.tool) + ": endTime=" + endTime + "秒");
                    setClipEndTime(clip, endTime);
                }

                // スケールと位置を設定（モーションエフェクト経由）
                setClipMotion(clip, scale, xPos, yPos);
            }

            return { success: true };

        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * ナレーション音声を配置（連続配置、time指定対応）
     * - time指定あり: 指定時間から開始
     * - time指定なし: 前のクリップの直後から連続配置
     */
    function placeNarration(seq, placement) {
        try {
            var audioPath = placement.path;
            var trackName = placement.track;
            var specifiedTime = placement.time;  // 解説リール用: 最初のナレーションの開始時間

            // ファイル存在確認
            var audioFile = new File(audioPath);
            if (!audioFile.exists) {
                return { success: false, error: "ファイルが見つかりません: " + audioPath };
            }

            // トラック番号を取得
            var trackIndex = AUDIO_TRACK_MAP[trackName];
            if (trackIndex === undefined) {
                return { success: false, error: "不明なトラック: " + trackName };
            }

            // 音声をプロジェクトにインポート
            var importResult = app.project.importFiles(
                [audioPath],
                true,
                app.project.rootItem,
                false
            );

            if (!importResult) {
                return { success: false, error: "インポート失敗" };
            }

            // インポートしたアイテムを検索
            var projectItem = findProjectItemByName(
                app.project.rootItem,
                audioFile.name
            );

            if (!projectItem) {
                return { success: false, error: "インポート後のアイテムが見つかりません" };
            }

            // タイムラインに配置
            var audioTrack = seq.audioTracks[trackIndex];
            if (!audioTrack) {
                return { success: false, error: "トラックが存在しません: " + trackName };
            }

            // 開始時間を決定
            var startTime;
            if (specifiedTime !== undefined && specifiedTime >= 0) {
                // time指定あり: 指定時間から開始
                startTime = specifiedTime;
            } else {
                // time指定なし: 同じトラックの最後のクリップの終了位置から配置
                startTime = getTrackEndTime(audioTrack);
            }

            // クリップを挿入
            audioTrack.overwriteClip(projectItem, startTime);

            return { success: true };

        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * アバター動画を配置
     *
     * 2つのモードに対応:
     * 1. ランキングリール用（ループモード）: loop: true, loop_until: 秒数
     * 2. 解説リール用（単発モード）: time: 秒数, duration: 秒数
     */
    function placeAvatarVideo(seq, placement) {
        try {
            var videoPath = placement.path;
            var trackName = placement.track;
            var startTime = placement.time;
            var duration = placement.duration;
            var shouldLoop = placement.loop;
            var loopUntil = placement.loop_until;

            // ファイル存在確認
            var videoFile = new File(videoPath);
            if (!videoFile.exists) {
                return { success: false, error: "ファイルが見つかりません: " + videoPath };
            }

            // トラック番号を取得
            var trackIndex = VIDEO_TRACK_MAP[trackName];
            if (trackIndex === undefined) {
                return { success: false, error: "不明なトラック: " + trackName };
            }

            // 動画をプロジェクトにインポート
            var importResult = app.project.importFiles(
                [videoPath],
                true,
                app.project.rootItem,
                false
            );

            if (!importResult) {
                return { success: false, error: "インポート失敗" };
            }

            // インポートしたアイテムを検索
            var projectItem = findProjectItemByName(
                app.project.rootItem,
                videoFile.name
            );

            if (!projectItem) {
                return { success: false, error: "インポート後のアイテムが見つかりません" };
            }

            // タイムラインに配置
            var videoTrack = seq.videoTracks[trackIndex];
            if (!videoTrack) {
                return { success: false, error: "トラックが存在しません: " + trackName };
            }

            // 開始時間を決定（未指定または-1の場合は前のクリップの直後）
            var actualStartTime = startTime;
            if (startTime === undefined || startTime < 0) {
                actualStartTime = getTrackEndTime(videoTrack);
            }

            // モード判定: loopがtrueならランキングリール用、それ以外は解説リール用
            if (shouldLoop && loopUntil !== undefined) {
                // ランキングリール用: ループ配置
                var currentTime = actualStartTime;
                var clipDuration = projectItem.getOutPoint().seconds - projectItem.getInPoint().seconds;

                // クリップの長さが取得できない場合は5秒と仮定
                if (!clipDuration || clipDuration <= 0) {
                    clipDuration = 5.0;
                }

                while (currentTime < loopUntil) {
                    videoTrack.overwriteClip(projectItem, currentTime);
                    // 動画の音声がA1に配置されるので削除
                    removeAudioClipAtTime(seq, currentTime);

                    // 配置したクリップを取得して長さを確認
                    var clip = findClipAtTime(videoTrack, currentTime);
                    if (clip) {
                        currentTime = clip.end.seconds;

                        // 最後のクリップがloopUntilを超える場合はトリム
                        if (currentTime > loopUntil) {
                            $.writeln("[placeAvatarVideo loop] トリム: " + loopUntil + "秒");
                            setClipEndTime(clip, loopUntil);
                        }
                    } else {
                        currentTime += clipDuration;
                    }
                }
            } else {
                // 解説リール用: 単発配置（duration指定で長さ調整）
                videoTrack.overwriteClip(projectItem, actualStartTime);
                // 動画の音声がA1に配置されるので削除
                removeAudioClipAtTime(seq, actualStartTime);

                // 配置したクリップを取得
                var clip = findClipAtTime(videoTrack, actualStartTime);
                if (clip) {
                    // durationが指定されている場合はクリップの長さを調整
                    if (duration !== undefined && duration > 0) {
                        $.writeln("[placeAvatarVideo] " + placement.name + ": endTime=" + (actualStartTime + duration) + "秒");
                        setClipEndTime(clip, actualStartTime + duration);
                    }

                    // スケール・位置設定
                    if (placement.scale !== undefined || placement.y !== undefined) {
                        $.writeln("[placeAvatarVideo] " + placement.name + ": scale=" + placement.scale + ", y=" + placement.y);
                        setClipMotion(clip, placement.scale, placement.x, placement.y);
                    }
                }
            }

            return { success: true };

        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * 効果音（SE）を配置
     * 解説リール用: decision, complete, typing など
     */
    function placeSoundEffect(seq, placement) {
        try {
            var audioPath = placement.path;
            var trackName = placement.track;
            var startTime = placement.time;
            var volume = placement.volume;

            // ファイル存在確認
            var audioFile = new File(audioPath);
            if (!audioFile.exists) {
                return { success: false, error: "ファイルが見つかりません: " + audioPath };
            }

            // トラック番号を取得
            var trackIndex = AUDIO_TRACK_MAP[trackName];
            if (trackIndex === undefined) {
                return { success: false, error: "不明なトラック: " + trackName };
            }

            // 音声をプロジェクトにインポート
            var importResult = app.project.importFiles(
                [audioPath],
                true,
                app.project.rootItem,
                false
            );

            if (!importResult) {
                return { success: false, error: "インポート失敗" };
            }

            // インポートしたアイテムを検索
            var projectItem = findProjectItemByName(
                app.project.rootItem,
                audioFile.name
            );

            if (!projectItem) {
                return { success: false, error: "インポート後のアイテムが見つかりません" };
            }

            // タイムラインに配置
            var audioTrack = seq.audioTracks[trackIndex];
            if (!audioTrack) {
                return { success: false, error: "トラックが存在しません: " + trackName };
            }

            // 指定時間に配置
            audioTrack.overwriteClip(projectItem, startTime);

            // ボリューム設定があれば適用
            if (volume !== undefined) {
                var clip = findClipAtTime(audioTrack, startTime);
                if (clip) {
                    $.writeln("[placeSoundEffect] " + placement.name + ": volume=" + volume + "dB");
                    setClipVolume(clip, volume);
                }
            }

            return { success: true };

        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * フック動画を配置（映像のみ、音声は別途hook_audioで配置）
     */
    function placeHookVideo(seq, placement) {
        try {
            var videoPath = placement.path;
            var trackName = placement.track;
            var startTime = placement.time;
            var duration = placement.duration;

            // ファイル存在確認
            var videoFile = new File(videoPath);
            if (!videoFile.exists) {
                return { success: false, error: "ファイルが見つかりません: " + videoPath };
            }

            // トラック番号を取得
            var trackIndex = VIDEO_TRACK_MAP[trackName];
            if (trackIndex === undefined) {
                return { success: false, error: "不明なトラック: " + trackName };
            }

            // 動画をプロジェクトにインポート
            var importResult = app.project.importFiles(
                [videoPath],
                true,
                app.project.rootItem,
                false
            );

            if (!importResult) {
                return { success: false, error: "インポート失敗" };
            }

            // インポートしたアイテムを検索
            var projectItem = findProjectItemByName(
                app.project.rootItem,
                videoFile.name
            );

            if (!projectItem) {
                return { success: false, error: "インポート後のアイテムが見つかりません" };
            }

            // タイムラインに配置
            var videoTrack = seq.videoTracks[trackIndex];
            if (!videoTrack) {
                return { success: false, error: "トラックが存在しません: " + trackName };
            }

            // クリップを挿入
            videoTrack.overwriteClip(projectItem, startTime);

            // 動画の音声がA1に自動配置されるので削除
            removeAudioClipAtTime(seq, startTime);

            // 配置したクリップを取得
            var clip = findClipAtTime(videoTrack, startTime);

            if (clip) {
                // 長さを設定
                if (duration && duration > 0) {
                    $.writeln("[placeHookVideo] endTime=" + (startTime + duration) + "秒");
                    setClipEndTime(clip, startTime + duration);
                }

                // スケール設定
                if (placement.scale !== undefined) {
                    $.writeln("[placeHookVideo] scale=" + placement.scale);
                    setClipMotion(clip, placement.scale, placement.x, placement.y);
                }
            }

            return { success: true };

        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * フック動画の音声を別トラック（A2）に配置
     * 注意: 動画ファイルを音声トラックに配置すると、映像も自動配置されるので削除する
     */
    function placeHookAudio(seq, placement) {
        try {
            var videoPath = placement.path;
            var trackName = placement.track;
            var startTime = placement.time;
            var duration = placement.duration;

            // ファイル存在確認
            var videoFile = new File(videoPath);
            if (!videoFile.exists) {
                return { success: false, error: "ファイルが見つかりません: " + videoPath };
            }

            // トラック番号を取得
            var trackIndex = AUDIO_TRACK_MAP[trackName];
            if (trackIndex === undefined) {
                return { success: false, error: "不明なトラック: " + trackName };
            }

            // 動画をプロジェクトにインポート（既にインポート済みの場合はスキップされる）
            var importResult = app.project.importFiles(
                [videoPath],
                true,
                app.project.rootItem,
                false
            );

            // インポートしたアイテムを検索
            var projectItem = findProjectItemByName(
                app.project.rootItem,
                videoFile.name
            );

            if (!projectItem) {
                return { success: false, error: "インポート後のアイテムが見つかりません" };
            }

            // タイムラインに配置（音声トラック）
            var audioTrack = seq.audioTracks[trackIndex];
            if (!audioTrack) {
                return { success: false, error: "トラックが存在しません: " + trackName };
            }

            // クリップを挿入
            audioTrack.overwriteClip(projectItem, startTime);

            // 動画ファイルを音声トラックに配置すると、映像が自動配置されるので削除
            // V3（index=2）は除外（hook_videoで意図的に配置済み）
            removeVideoClipAtTime(seq, startTime, VIDEO_TRACK_MAP["V3"]);

            // 配置したクリップを取得
            var clip = findClipAtTime(audioTrack, startTime);

            if (clip) {
                // 長さを設定
                if (duration && duration > 0) {
                    setClipEndTime(clip, startTime + duration);
                }
            }

            return { success: true };

        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * 指定時間にあるA1の音声クリップを削除（動画の音声を除去）
     */
    function removeAudioClipAtTime(seq, timeInSeconds) {
        try {
            var audioTrack = seq.audioTracks[0];  // A1
            if (!audioTrack) return;

            // 指定時間付近のクリップを探して削除
            for (var i = audioTrack.clips.numItems - 1; i >= 0; i--) {
                var clip = audioTrack.clips[i];
                if (Math.abs(clip.start.seconds - timeInSeconds) < 0.5) {
                    clip.remove(false, false);
                    break;
                }
            }
        } catch (e) {
            $.writeln("音声クリップ削除エラー: " + e.message);
        }
    }

    /**
     * 指定時間にある映像クリップを削除（特定トラックを除外可能）
     * hook_audio配置時に自動追加される映像を除去
     * @param excludeTrackIndex 除外するトラックインデックス（0始まり）、省略可
     */
    function removeVideoClipAtTime(seq, timeInSeconds, excludeTrackIndex) {
        try {
            // 全ビデオトラックをチェック（V1〜V14）
            for (var t = 0; t < seq.videoTracks.numTracks; t++) {
                // 除外トラックはスキップ
                if (excludeTrackIndex !== undefined && t === excludeTrackIndex) {
                    continue;
                }

                var videoTrack = seq.videoTracks[t];
                if (!videoTrack) continue;

                // 指定時間付近のクリップを探して削除
                for (var i = videoTrack.clips.numItems - 1; i >= 0; i--) {
                    var clip = videoTrack.clips[i];
                    if (Math.abs(clip.start.seconds - timeInSeconds) < 0.5) {
                        $.writeln("[removeVideoClipAtTime] V" + (t + 1) + "から削除: " + clip.start.seconds + "秒");
                        clip.remove(false, false);
                        break;
                    }
                }
            }
        } catch (e) {
            $.writeln("[removeVideoClipAtTime] エラー: " + e.message);
        }
    }

    /**
     * クリップの終了時間を設定（秒数指定）
     * Premiere ProのTime形式に対応
     */
    function setClipEndTime(clip, endTimeSeconds) {
        try {
            // 方法1: 直接秒数で設定
            clip.end = endTimeSeconds;
            $.writeln("clip.end設定: " + endTimeSeconds + "秒 -> 結果: " + clip.end.seconds + "秒");
        } catch (e) {
            $.writeln("clip.end設定エラー: " + e.message);
        }
    }

    /**
     * トラックの最後のクリップの終了時間を取得
     */
    function getTrackEndTime(track) {
        var endTime = 0;
        for (var i = 0; i < track.clips.numItems; i++) {
            var clipEnd = track.clips[i].end.seconds;
            if (clipEnd > endTime) {
                endTime = clipEnd;
            }
        }
        return endTime;
    }

    /**
     * A1の終了時間に合わせて、各トラックの最後のクリップを延長
     * 対象: V1(アバター), V7(トリガー), V14(字幕背景), A3(BGM)
     */
    function extendTracksToEndTime(seq, endTime) {
        $.writeln("[extendTracksToEndTime] 終了時間を " + endTime + "秒 に統一");

        // 延長対象のビデオトラック
        var videoTracksToExtend = [
            { index: VIDEO_TRACK_MAP["V1"], name: "V1 (avatar)" },
            { index: VIDEO_TRACK_MAP["V7"], name: "V7 (trigger)" },
            { index: VIDEO_TRACK_MAP["V14"], name: "V14 (telop_back)" }
        ];

        // 延長対象のオーディオトラック
        var audioTracksToExtend = [
            { index: AUDIO_TRACK_MAP["A3"], name: "A3 (BGM)" }
        ];

        // ビデオトラックの最後のクリップを延長
        for (var i = 0; i < videoTracksToExtend.length; i++) {
            var trackInfo = videoTracksToExtend[i];
            var track = seq.videoTracks[trackInfo.index];
            if (track && track.clips.numItems > 0) {
                var lastClip = getLastClipOnTrack(track);
                if (lastClip && lastClip.end.seconds < endTime) {
                    $.writeln("[extendTracksToEndTime] " + trackInfo.name + ": " + lastClip.end.seconds + "秒 -> " + endTime + "秒");
                    setClipEndTime(lastClip, endTime);
                }
            }
        }

        // オーディオトラックの最後のクリップを延長
        for (var i = 0; i < audioTracksToExtend.length; i++) {
            var trackInfo = audioTracksToExtend[i];
            var track = seq.audioTracks[trackInfo.index];
            if (track && track.clips.numItems > 0) {
                var lastClip = getLastClipOnTrack(track);
                if (lastClip && lastClip.end.seconds < endTime) {
                    $.writeln("[extendTracksToEndTime] " + trackInfo.name + ": " + lastClip.end.seconds + "秒 -> " + endTime + "秒");
                    setClipEndTime(lastClip, endTime);
                }
            }
        }
    }

    /**
     * トラック上の最後のクリップを取得
     */
    function getLastClipOnTrack(track) {
        var lastClip = null;
        var latestEnd = 0;
        for (var i = 0; i < track.clips.numItems; i++) {
            var clip = track.clips[i];
            if (clip.end.seconds > latestEnd) {
                latestEnd = clip.end.seconds;
                lastClip = clip;
            }
        }
        return lastClip;
    }

    /**
     * 指定時間にあるクリップを検索
     */
    function findClipAtTime(track, timeInSeconds) {
        for (var i = 0; i < track.clips.numItems; i++) {
            var clip = track.clips[i];
            if (clip.start.seconds <= timeInSeconds && clip.end.seconds > timeInSeconds) {
                return clip;
            }
        }
        // 見つからない場合、開始時間が一致するクリップを探す
        for (var i = 0; i < track.clips.numItems; i++) {
            var clip = track.clips[i];
            if (Math.abs(clip.start.seconds - timeInSeconds) < 0.1) {
                return clip;
            }
        }
        return null;
    }

    /**
     * クリップのモーション（スケール・位置）を設定
     * 位置は正規化値（0〜1）で設定
     */
    function setClipMotion(clip, scale, xPos, yPos) {
        try {
            // クリップのコンポーネントを取得
            var components = clip.components;

            // ピクセル値を正規化（0〜1）に変換
            var normalizedX = xPos / FRAME_WIDTH;
            var normalizedY = yPos / FRAME_HEIGHT;

            for (var i = 0; i < components.numItems; i++) {
                var component = components[i];

                // モーションエフェクトを探す
                if (component.displayName === "モーション" || component.displayName === "Motion") {
                    var properties = component.properties;

                    for (var j = 0; j < properties.numItems; j++) {
                        var prop = properties[j];

                        // スケール（setValueで動作する）
                        if (prop.displayName === "スケール" || prop.displayName === "Scale") {
                            if (scale !== undefined) {
                                try {
                                    prop.setValue(scale, true);
                                } catch (e1) {
                                    $.writeln("スケール設定エラー: " + e1.message);
                                }
                            }
                        }

                        // 位置（正規化値で設定）
                        if (prop.displayName === "位置" || prop.displayName === "Position") {
                            if (xPos !== undefined && yPos !== undefined) {
                                try {
                                    prop.setValue([normalizedX, normalizedY], true);
                                } catch (e2) {
                                    $.writeln("位置設定エラー: " + e2.message);
                                }
                            }
                        }
                    }
                    break;
                }
            }
        } catch (e) {
            $.writeln("モーション設定エラー: " + e.message);
        }
    }

    /**
     * クリップのクロップを設定（%指定）
     * Premiere Proのクロップエフェクトを使用
     */
    function setClipCrop(clip, left, right, top, bottom) {
        try {
            var components = clip.components;

            for (var i = 0; i < components.numItems; i++) {
                var component = components[i];

                // クロップエフェクトを探す
                if (component.displayName === "クロップ" || component.displayName === "Crop") {
                    var properties = component.properties;

                    for (var j = 0; j < properties.numItems; j++) {
                        var prop = properties[j];

                        // 左
                        if ((prop.displayName === "左" || prop.displayName === "Left") && left !== undefined) {
                            try {
                                prop.setValue(left, true);
                            } catch (e) {
                                $.writeln("クロップ左設定エラー: " + e.message);
                            }
                        }
                        // 右
                        if ((prop.displayName === "右" || prop.displayName === "Right") && right !== undefined) {
                            try {
                                prop.setValue(right, true);
                            } catch (e) {
                                $.writeln("クロップ右設定エラー: " + e.message);
                            }
                        }
                        // 上
                        if ((prop.displayName === "上" || prop.displayName === "Top") && top !== undefined) {
                            try {
                                prop.setValue(top, true);
                            } catch (e) {
                                $.writeln("クロップ上設定エラー: " + e.message);
                            }
                        }
                        // 下
                        if ((prop.displayName === "下" || prop.displayName === "Bottom") && bottom !== undefined) {
                            try {
                                prop.setValue(bottom, true);
                            } catch (e) {
                                $.writeln("クロップ下設定エラー: " + e.message);
                            }
                        }
                    }
                    break;
                }
            }
        } catch (e) {
            $.writeln("クロップ設定エラー: " + e.message);
        }
    }

    /**
     * dBをリニアスケールに変換
     * Premiere Proは音量をリニアスケール（1.0 = 0dB）で管理
     */
    function dbToLinear(db) {
        return Math.pow(10, db / 20);
    }

    /**
     * クリップのボリュームを設定（dB指定 → リニア変換）
     * 参考: https://community.adobe.com/t5/premiere-pro/adjust-audio-levels-of-a-clip-with-extendscript/td-p/10072237
     */
    function setClipVolume(clip, volumeDb) {
        try {
            var components = clip.components;
            var linearValue = dbToLinear(volumeDb);
            $.writeln("[setClipVolume] " + volumeDb + "dB -> リニア値: " + linearValue);

            // 方法1: インデックス直接指定（Adobe推奨パターン）
            // オーディオクリップは通常 components[0].properties[1] がボリュームレベル
            if (components.numItems > 0) {
                var volumeComponent = components[0];
                $.writeln("[setClipVolume] コンポーネント[0]: " + volumeComponent.displayName);

                if (volumeComponent.properties.numItems > 1) {
                    var levelProp = volumeComponent.properties[1];
                    $.writeln("[setClipVolume] プロパティ[1]: " + levelProp.displayName);

                    try {
                        // 重要: setTimeVarying(false)を先に呼ぶ必要がある
                        levelProp.setTimeVarying(false);
                        $.writeln("[setClipVolume] setTimeVarying(false) 完了");

                        $.writeln("[setClipVolume] 設定前: " + levelProp.getValue());
                        levelProp.setValue(linearValue, true);
                        $.writeln("[setClipVolume] 設定後: " + levelProp.getValue());
                        return;  // 成功
                    } catch (e) {
                        $.writeln("[setClipVolume] インデックス方式エラー: " + e.message);
                    }
                }
            }

            // 方法2: 名前検索（フォールバック）
            $.writeln("[setClipVolume] 名前検索でフォールバック...");
            for (var i = 0; i < components.numItems; i++) {
                var component = components[i];
                $.writeln("[setClipVolume] コンポーネント[" + i + "]: " + component.displayName);

                // ボリュームエフェクトを探す（日本語・英語両対応）
                if (component.displayName === "ボリューム" ||
                    component.displayName === "Volume" ||
                    component.displayName.indexOf("ボリューム") >= 0 ||
                    component.displayName.indexOf("Volume") >= 0) {

                    var properties = component.properties;

                    for (var j = 0; j < properties.numItems; j++) {
                        var prop = properties[j];
                        $.writeln("[setClipVolume] プロパティ[" + j + "]: " + prop.displayName);

                        if (prop.displayName === "レベル" ||
                            prop.displayName === "Level" ||
                            prop.displayName.indexOf("レベル") >= 0 ||
                            prop.displayName.indexOf("Level") >= 0) {
                            try {
                                prop.setTimeVarying(false);
                                $.writeln("[setClipVolume] 設定前: " + prop.getValue());
                                prop.setValue(linearValue, true);
                                $.writeln("[setClipVolume] 設定後: " + prop.getValue());
                            } catch (e) {
                                $.writeln("[setClipVolume] setValue エラー: " + e.message);
                            }
                            return;  // 設定完了
                        }
                    }
                }
            }
            $.writeln("[setClipVolume] ボリュームコンポーネントが見つかりませんでした");
        } catch (e) {
            $.writeln("[setClipVolume] エラー: " + e.message);
        }
    }

    /**
     * プロジェクトアイテムを名前で検索（再帰）
     */
    function findProjectItemByName(parentItem, name) {
        for (var i = 0; i < parentItem.children.numItems; i++) {
            var child = parentItem.children[i];
            if (child.name === name) {
                return child;
            }
            if (child.type === ProjectItemType.BIN) {
                var found = findProjectItemByName(child, name);
                if (found) return found;
            }
        }
        return null;
    }

    // 実行
    main();

})();
