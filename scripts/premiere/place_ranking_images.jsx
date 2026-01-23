/**
 * Premiere Pro ExtendScript: ランキング画像自動配置
 *
 * 使い方:
 * 1. Premiere Proでプロジェクトを開く
 * 2. シーケンスをアクティブにする
 * 3. VSCodeからF5で実行（ExtendScript Debugger使用）
 *
 * 前提条件:
 * - placement.json が同じフォルダにある
 * - 画像ファイルが指定パスに存在する
 */

(function() {
    // ========== 設定 ==========

    // JSONファイルのパス（スクリプトと同じフォルダ）
    var scriptFolder = (new File($.fileName)).parent;
    var jsonPath = scriptFolder.fsName + "\\placement.json";

    // トラック番号マッピング（0始まり）
    var TRACK_MAP = {
        "V5": 4,
        "V6": 5,
        "V7": 6,
        "V8": 7,
        "V9": 8,
        "V10": 9,
        "V11": 10,
        "V12": 11
    };

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
            var result = placeImage(seq, p);
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
                errors.push(p.tool + ": " + result.error);
            }
        }

        // 結果を表示
        var message = "完了!\n";
        message += "成功: " + successCount + " 件\n";
        message += "失敗: " + errorCount + " 件";
        if (errors.length > 0) {
            message += "\n\nエラー詳細:\n" + errors.join("\n");
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
     * 画像をインポートして指定位置に配置（スケール・座標・長さ設定）
     */
    function placeImage(seq, placement) {
        try {
            var imagePath = placement.image;
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
            var trackIndex = TRACK_MAP[trackName];
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

            // 配置したクリップを取得（最後に追加されたクリップ）
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
     */
    function setClipMotion(clip, scale, xPos, yPos) {
        try {
            // クリップのコンポーネントを取得
            var components = clip.components;

            for (var i = 0; i < components.numItems; i++) {
                var component = components[i];

                // モーションエフェクトを探す
                if (component.displayName === "モーション" || component.displayName === "Motion") {
                    var properties = component.properties;

                    for (var j = 0; j < properties.numItems; j++) {
                        var prop = properties[j];

                        // スケール
                        if (prop.displayName === "スケール" || prop.displayName === "Scale") {
                            if (scale !== undefined) {
                                prop.setValue(scale, true);
                            }
                        }

                        // 位置
                        if (prop.displayName === "位置" || prop.displayName === "Position") {
                            if (xPos !== undefined && yPos !== undefined) {
                                prop.setValue([xPos, yPos], true);
                            }
                        }
                    }
                    break;
                }
            }
        } catch (e) {
            // モーション設定に失敗してもエラーにしない（配置は成功している）
            $.writeln("モーション設定エラー: " + e.message);
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
