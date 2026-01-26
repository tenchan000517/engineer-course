/**
 * Premiere Pro ExtendScript: ランキングリール素材自動配置
 *
 * 使い方:
 * 1. Premiere Proでプロジェクトを開く
 * 2. シーケンスをアクティブにする
 * 3. VSCodeからF5で実行（ExtendScript Debugger使用）
 *
 * 前提条件:
 * - placement.json が同じフォルダにある
 * - 素材ファイルが指定パスに存在する
 */

(function() {
    // ========== 設定 ==========

    // JSONファイルのパス（スクリプトと同じフォルダ）
    var scriptFolder = (new File($.fileName)).parent;
    var jsonPath = scriptFolder.fsName + "\\placement.json";

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
                case 'shared':
                case 'avatar_still':
                    result = placeMedia(seq, p);
                    break;
                case 'ranking':
                    result = placeRankingIcon(seq, p);
                    break;
                case 'narration':
                    result = placeNarration(seq, p);
                    break;
                case 'avatar_video':
                    result = placeAvatarVideo(seq, p);
                    break;
                case 'prompt_screenshot':
                    result = placeRankingIcon(seq, p);  // ランキングアイコンと同じ処理で配置
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

            // 配置したクリップを取得
            var clip = findClipAtTime(track, timeInSeconds);

            if (clip) {
                // 長さを設定
                if (duration && duration > 0) {
                    var endTime = timeInSeconds + duration;
                    clip.end = endTime;
                }

                // ボリューム設定（オーディオのみ）
                if (isAudio && placement.volume !== undefined) {
                    setClipVolume(clip, placement.volume);
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
                    clip.end = endTime;
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
     * ナレーション音声を配置（連続配置）
     */
    var narrationEndTimes = { "A1": 0, "A2": 0 };  // トラックごとの終了時間を追跡

    function placeNarration(seq, placement) {
        try {
            var audioPath = placement.path;
            var trackName = placement.track;

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

            // ナレーションは番号順に連続配置
            // 同じトラックの最後のクリップの終了位置から配置
            var startTime = getTrackEndTime(audioTrack);

            // クリップを挿入
            audioTrack.overwriteClip(projectItem, startTime);

            return { success: true };

        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * アバター動画を配置（ループ対応）
     */
    function placeAvatarVideo(seq, placement) {
        try {
            var videoPath = placement.path;
            var trackName = placement.track;
            var startTime = placement.time;
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

            // 開始時間を決定（-1の場合は前のクリップの直後）
            var actualStartTime = startTime;
            if (startTime < 0) {
                actualStartTime = getTrackEndTime(videoTrack);
            }

            if (!shouldLoop) {
                // ループなし：1回だけ配置
                videoTrack.overwriteClip(projectItem, actualStartTime);
                // 動画の音声がA1に配置されるので削除
                removeAudioClipAtTime(seq, actualStartTime);
            } else {
                // ループあり：loopUntilまで繰り返し配置
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
                        var actualDuration = clip.end.seconds - clip.start.seconds;
                        currentTime = clip.end.seconds;

                        // 最後のクリップがloopUntilを超える場合はトリム
                        if (currentTime > loopUntil) {
                            clip.end = loopUntil;
                        }
                    } else {
                        currentTime += clipDuration;
                    }
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
     * クリップのボリュームを設定（dB）
     */
    function setClipVolume(clip, volumeDb) {
        try {
            var components = clip.components;

            for (var i = 0; i < components.numItems; i++) {
                var component = components[i];

                // ボリュームエフェクトを探す
                if (component.displayName === "ボリューム" || component.displayName === "Volume") {
                    var properties = component.properties;

                    for (var j = 0; j < properties.numItems; j++) {
                        var prop = properties[j];

                        if (prop.displayName === "レベル" || prop.displayName === "Level") {
                            try {
                                prop.setValue(volumeDb, true);
                            } catch (e) {
                                $.writeln("ボリューム設定エラー: " + e.message);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        } catch (e) {
            $.writeln("ボリューム設定エラー: " + e.message);
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
