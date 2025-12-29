# Nanobanana 本番コマンド（参照画像あり）

参照画像を使用するコマンドです。
事前準備（01-Prep）を実行してから、このファイルのコマンドを実行してください。
C:\nanobanana\ で実行してください。

---

# 前提条件

以下のファイルが存在すること：

| 参照画像 | コピー元 | 用途 |
|---------|---------|------|
| selfie.jpg | sample_portrait.png | 写真変換 |
| original_photo.jpg | sample_portrait.png | 背景変更 |
| summer_photo.jpg | sample_outdoor.png | 背景変更 |
| portrait.jpg | sample_portrait.png | 背景変更 |
| black_jacket.jpg | sample_formal.png | 部分編集 |
| street_photo.jpg | sample_outdoor.png | 部分編集 |
| portrait_no_glasses.jpg | sample_portrait.png | 部分編集 |
| neutral_face.jpg | sample_portrait.png | 部分編集 |
| casual_photo.jpg | sample_formal.png | 部分編集 |

---

# Module 07: 参照画像を使う本番コマンド

## Step 1: 写真変換（1枚）

python generate_image.py "Transform this photo into a professional LinkedIn headshot. Requirements: - Maintain exact facial features and identity from the input image - Background: Softly blurred office with large windows - Lighting: Soft daylight from the front - Style: Clean, realistic, subtle retouching, no heavy filters - Adjust to professional attire if needed (navy blazer, white shirt). Keep the person's natural appearance while enhancing professionalism. The result should look like a photo taken by a professional photographer." --ref selfie.jpg --out professional_headshot.png --ratio 3:4

---

## Step 2: 背景変更（3枚）

python generate_image.py "Replace the background of this image with a professional studio setting. Requirements: - New background: Softly lit neutral gray gradient - Keep the subject (person/object) completely unchanged - Maintain original proportions and lighting direction on subject - Natural edge blending, no visible cutout artifacts - Professional studio photography aesthetic" --ref original_photo.jpg --out studio_background.png --ratio 1:1 && python generate_image.py "Transform this image into a winter setting. Changes: - Convert the green landscape to snow-covered scenery - Add falling snowflakes in the foreground (subtle, not overwhelming) - Adjust the lighting to cool, overcast winter tones - Add frost or snow on surfaces visible in the image. Keep Unchanged: - The main subject (person) exactly as they are - Facial features, expression, pose - Clothing (unless it would look unnatural in winter). Optional Enhancements: - Add visible breath mist if appropriate - Apply cool color grading to the overall image" --ref summer_photo.jpg --out winter_scene.png --ratio 1:1 && python generate_image.py "Replace the background with a magical fantasy setting. New Environment: - Floating islands with cascading waterfalls - Purple and pink twilight sky with two moons - Magical particle effects (sparkles, floating lights) - Ethereal mist in the distance. Integration: - Apply dramatic rim lighting on the subject matching the new scene - Add subtle magical glow around the subject's edges - Maintain the subject's original pose and expression - Seamless integration with fantasy lighting. The subject should look like they truly belong in this magical world." --ref portrait.jpg --out fantasy_portrait.png --ratio 16:9

---

## Step 3: 部分編集（5枚）

python generate_image.py "Using this image, change only the jacket color from black to burgundy red. Keep everything else exactly the same: - Same fabric texture and material appearance - Same lighting and shadows on the jacket - Same background, no changes - Same person's face, hair, and expression - Same fit and style of the jacket. Only the color should change from black to deep burgundy red." --ref black_jacket.jpg --out burgundy_jacket.png --ratio 1:1 && python generate_image.py "Remove the car visible in the background of this image. Requirements: - Fill the area naturally with the surrounding environment - Extend the street/sidewalk/landscape where the car was - Maintain consistent lighting and texture - Keep the main subject (person in foreground) completely unchanged - Seamless blend with no visible editing artifacts. The result should look like the car was never there." --ref street_photo.jpg --out car_removed.png --ratio 1:1 && python generate_image.py "Add stylish black-framed glasses to this person's face. Requirements: - Modern rectangular frames, thin black plastic - Position naturally on the nose bridge - Add appropriate reflections matching the lighting in the image - Add subtle shadows under the frames - Match the lighting direction of the original image - Keep all other facial features exactly the same. The glasses should look natural, as if they were worn when the photo was taken." --ref portrait_no_glasses.jpg --out portrait_with_glasses.png --ratio 1:1 && python generate_image.py "Change the person's expression from neutral to a warm, genuine smile. Requirements: - Natural, warm smile (not exaggerated) - Slight crow's feet at the corners of the eyes (genuine smile indicator) - Relaxed, happy expression - Maintain exact facial structure and identity - Keep lighting, background, and clothing unchanged. The smile should look natural and not artificial or forced." --ref neutral_face.jpg --out smiling_face.png --ratio 1:1 && python generate_image.py "Make the following changes to this image: 1. Change the person's hair color from brown to platinum blonde. 2. Add subtle professional makeup (natural look). 3. Replace the casual t-shirt with a white silk blouse. Keep unchanged: - Facial features and structure - Background - Lighting direction - Overall composition. Each change should look natural and professionally done." --ref casual_photo.jpg --out professional_edit.png --ratio 1:1

---

# 生成画像サマリー

| Step | 内容 | 枚数 |
|------|------|------|
| 1 | 写真変換 | 1枚 |
| 2 | 背景変更 | 3枚 |
| 3 | 部分編集 | 5枚 |
| **合計** | | **9枚** |

---

# 参照画像 → 出力画像 対応表

| 参照画像 | 出力画像 | 編集内容 |
|---------|---------|---------|
| selfie.jpg | professional_headshot.png | プロフェッショナル変換 |
| original_photo.jpg | studio_background.png | スタジオ背景 |
| summer_photo.jpg | winter_scene.png | 冬景色に変換 |
| portrait.jpg | fantasy_portrait.png | ファンタジー背景 |
| black_jacket.jpg | burgundy_jacket.png | ジャケット色変更 |
| street_photo.jpg | car_removed.png | 車を削除 |
| portrait_no_glasses.jpg | portrait_with_glasses.png | メガネ追加 |
| neutral_face.jpg | smiling_face.png | 笑顔に変更 |
| casual_photo.jpg | professional_edit.png | 髪色・服・メイク変更 |
