# Nanobanana Module 07 コマンド一覧

Module 07（実写・テキスト・編集）で使用するコマンド集です。
各ステップごとにコピー＆ペーストで一度に実行できます。

---

## Step 1: 事前準備（サンプル画像生成）

python generate_image.py "A photorealistic portrait of a 30-year-old Japanese woman. Subject Details: Shoulder-length black hair with natural texture, warm brown eyes with a gentle expression, natural skin with subtle makeup, wearing a light blue casual blouse. Expression: Calm, friendly smile. Setting: Indoor environment with soft natural light, blurred home background, warm inviting atmosphere. Technical: Bust-up shot facing camera, 50mm lens natural perspective, soft lighting from window. Style: Natural candid photo aesthetic." --out sample_portrait.png --ratio 3:4 && python generate_image.py "A photorealistic outdoor photo of a 30-year-old Japanese woman in a summer park. Subject Details: Shoulder-length black hair, warm brown eyes, wearing a white t-shirt and jeans, standing casually. Environment: Lush green summer park, bright sunny day, trees and grass in background, a parked car visible in the distance, other people walking in background. Technical: Full body shot, 35mm lens environmental portrait, natural daylight with slight shadows. Style: Casual summer snapshot aesthetic." --out sample_outdoor.png --ratio 4:3 && python generate_image.py "A photorealistic portrait of a 30-year-old Japanese woman in business casual attire. Subject Details: Shoulder-length brown hair, warm brown eyes, neutral expression, wearing a black blazer jacket over a gray t-shirt. Setting: Simple indoor background, neutral office-like environment, soft even lighting. Technical: Upper body shot, 50mm lens, professional but casual. Style: Business casual portrait with natural lighting." --out sample_formal.png --ratio 3:4

---

## Step 2: ファイルコピー（Windowsの場合）

copy sample_portrait.png selfie.jpg && copy sample_portrait.png original_photo.jpg && copy sample_portrait.png portrait.jpg && copy sample_portrait.png portrait_no_glasses.jpg && copy sample_portrait.png neutral_face.jpg && copy sample_outdoor.png summer_photo.jpg && copy sample_outdoor.png street_photo.jpg && copy sample_formal.png black_jacket.jpg && copy sample_formal.png casual_photo.jpg

---

## Step 3: セクション2-3 テキスト埋め込み

python generate_image.py "Create an inspirational quote image. Text Content: Main quote Dream big work hard, Author Anonymous, Position Centered in frame. Visual Design: Soft sunrise over misty mountains, warm orange and pink gradient sky, quote in elegant white serif typography, text has subtle drop shadow for readability, clean minimal aesthetic. Mood: Hopeful motivational peaceful." --out quote_image.png && python generate_image.py "Create a Twitter X header banner. Text: Name Tech Insights in bold sans-serif, Tagline Exploring the future of technology, Position Left-aligned. Visual Elements: Abstract tech background with circuit patterns and data streams, deep blue to purple gradient, subtle glowing elements, modern professional aesthetic. Style Clean corporate tech." --out twitter_header.png --ratio 16:9

---

## Step 4: セクション4 背景変更

python generate_image.py "Replace the background of Image 1 with a professional studio setting. Keep the person exactly as they are: same pose, same expression, same clothing, same lighting on face. New Background: Clean neutral gray gradient backdrop, professional studio lighting setup visible, soft shadows on floor, corporate headshot style. Seamless edge integration." --ref original_photo.jpg --out studio_background.png --ratio 3:4 && python generate_image.py "Transform this summer photo Image 1 to a winter scene. Keep: The exact person pose clothing. Change: Green leaves to bare branches with snow, green grass to snow-covered ground, summer sky to overcast winter sky, add visible breath vapor, add snowflakes falling gently. Maintain photorealistic quality." --ref summer_photo.jpg --out winter_version.png --ratio 4:3 && python generate_image.py "Place the person from Image 1 into a fantasy environment. Keep the person exactly as they appear in Image 1. New Environment: Standing on a cliff overlooking a magical kingdom, floating islands in the distance, two moons in the twilight sky, bioluminescent plants nearby. Integration: Match fantasy lighting to the person, add magical particle effects around them, seamless blending between real person and fantasy world." --ref portrait.jpg --out fantasy_portrait.png --ratio 16:9

---

## Step 5: セクション5 部分編集

python generate_image.py "Edit Image 1 to change only the jacket color. Current: Black blazer jacket. Change to: Deep burgundy wine red. Keep everything else identical: Same person face expression, same pose and composition, same background, same lighting and shadows, same fabric texture. Only the jacket color changes." --ref black_jacket.jpg --out burgundy_jacket.png --ratio 3:4 && python generate_image.py "Remove the distracting elements from the background of Image 1. Remove: The parked car in the background, any people in the background. Keep: The main subject exactly as they are, natural-looking background fill, consistent lighting and perspective, photorealistic result. The background should look naturally empty." --ref street_photo.jpg --out clean_background.png --ratio 4:3 && python generate_image.py "Add stylish glasses to the person in Image 1. Glasses to add: Modern rectangular black frames, anti-reflective lenses with subtle reflection, sitting naturally on the nose bridge, temple arms behind ears. Integration: Match lighting and shadows, realistic lens distortion, glasses should look natural not edited. Keep everything else in the image identical." --ref portrait_no_glasses.jpg --out with_glasses.png --ratio 3:4 && python generate_image.py "Change the expression of the person in Image 1. Current: Neutral expression. Change to: Warm genuine smile. Keep: Same person identical features, same pose and angle, same lighting and background, same clothing. Only the expression changes: Natural smile showing some teeth, crow feet at eyes, raised cheeks, relaxed happy appearance." --ref neutral_face.jpg --out smiling_face.png --ratio 3:4 && python generate_image.py "Make multiple edits to Image 1. Changes: 1 Hair color Brown to platinum blonde, 2 Jacket color Black to white, 3 Add elegant pearl earrings, 4 Enhance makeup slightly with subtle eyeliner and lip color. Keep identical: Face structure and features, pose and composition, background, overall image quality. All changes should look natural and cohesive." --ref casual_photo.jpg --out transformed_look.png --ratio 3:4

---

## 参照画像について

| ファイル名 | 用途 | コピー元 |
|-----------|------|----------|
| selfie.jpg | 2-3 写真変換 | sample_portrait.png |
| original_photo.jpg | 4-1 背景変更 | sample_portrait.png |
| summer_photo.jpg | 4-2 季節変更 | sample_outdoor.png |
| portrait.jpg | 4-3 ファンタジー | sample_portrait.png |
| black_jacket.jpg | 5-1 色変更 | sample_formal.png |
| street_photo.jpg | 5-2 削除 | sample_outdoor.png |
| portrait_no_glasses.jpg | 5-3 追加 | sample_portrait.png |
| neutral_face.jpg | 5-4 表情 | sample_portrait.png |
| casual_photo.jpg | 5-5 複合 | sample_formal.png |
