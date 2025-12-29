# Nanobanana Module 06 コマンド一覧

Module 06（参照画像活用）で使用するデフォルトコマンド集です。
参照画像には Module 05 で生成したキャラクターシートと、Module 06 事前準備で生成した画像を使用します。


## セクション2: キャラクター配置

### 2-2. ビジネスシーン合成

python generate_image.py "Place the person from Image 1 into the office environment shown in Image 2. Specifications: - Position: Standing confidently near the window - Maintain exact facial features, hairstyle, and skin tone from Image 1 - Adjust clothing to match professional context if needed - Match the warm afternoon lighting from Image 2 - Natural shadow placement consistent with light source - Scale the character appropriately for the room. The result should look like a natural photograph taken in this office." --ref character_sheet_yuki.png office_background.jpg --out business_scene.png --ratio 16:9

### 2-3. ファンタジーシーン合成

python generate_image.py "Place the character from Image 1 into the mystical forest from Image 2. Specifications: - Character is walking on the forest path, viewed from 3/4 angle - Retain all character details: armor design, weapon, facial features - Apply the magical blue-green lighting from Image 2 to the character - Add subtle fog around the character's feet for depth integration - Maintain fantasy illustration style consistent with Image 2 - The character should appear to belong in this world. Seamless integration between character and environment." --ref character_sheet_yuki.png fantasy_forest.png --out fantasy_scene.png --ratio 16:9

### 2-4. 位置・スケール指定

python generate_image.py "Place the character from Image 1 into Image 2. Position and Scale: - Character positioned in the right third of the frame - Character occupies approximately 60% of the frame height - Facing left, looking towards the center of the image - Feet touching the ground naturally - Slight 3/4 turn towards the viewer. Environment Integration: - Match the lighting direction from the background (light from upper left) - Apply appropriate shadows on the ground - Adjust color temperature to match the scene" --ref character_sheet_yuki.png background.png --out positioned_scene.png


## セクション3: スタイル転写

### 3-2. 油絵風変換

python generate_image.py "Transform the photo (Image 1) into the painting style shown in Image 2. Style Transfer Specifications: - Preserve the scene composition and lighting direction from Image 1 - Apply the thick, expressive brushstrokes from Image 2 - Use the swirling, dynamic patterns characteristic of the style - Adopt the vibrant color palette (especially blues and yellows) - Maintain recognizable facial features if a person is present - Add visible paint texture and impasto effects. The result should feel like an original oil painting, not a filter." --ref photo.jpg vangogh_style.jpg --out oil_painting.png

### 3-3. アニメ風変換

python generate_image.py "Transform this selfie (Image 1) into Japanese anime style matching Image 2. Style Transfer Specifications: - Keep my exact facial structure, hairstyle, and expression - Apply the cel-shading and bold outlines from Image 2 - Use the color palette and lighting style from Image 2 - Large expressive eyes while maintaining face recognition - Clean, professional anime illustration quality - Smooth skin with anime-style shading - Simplified but recognizable features. The result should look like official anime character art." --ref selfie.jpg anime_style_reference.png --out anime_portrait.png --ratio 3:4

### 3-4. 水彩画風変換

python generate_image.py "Transform Image 1 into a delicate watercolor painting style. - Soft, translucent washes of color - Visible paper texture showing through - Loose, flowing brushwork - Colors bleeding slightly at edges - Light, airy feel with white paper highlights" --ref photo.jpg --out watercolor_style.png

### 3-4. 浮世絵風変換

python generate_image.py "Transform Image 1 into traditional Japanese ukiyo-e woodblock print style. - Flat areas of color with bold black outlines - Limited color palette (traditional Japanese colors) - Stylized waves or patterns in background - No gradients, only solid colors - Decorative border elements" --ref photo.jpg --out ukiyoe_style.png


## セクション4: 複数参照画像の組み合わせ

### 4-1. 3画像合成（Subject + Background + Style）

python generate_image.py "Create a new image combining elements from all three reference images: Image 1 (Subject Reference): - Use the character's identity (facial features, body type). Image 2 (Background Reference): - Use this environment and setting - Maintain the architecture and spatial layout. Image 3 (Style Reference): - Apply this artistic style (color palette, brushwork, lighting). Specifications: - Character from Image 1 standing in the center of Image 2's environment - Apply the artistic style and mood from Image 3 - Seamless integration between all elements - Consistent lighting derived from Image 3's style" --ref character_sheet_yuki.png background.png ghibli_style_reference.jpg --out combined_scene.png --ratio 16:9

### 4-2. ジブリ風シーン

python generate_image.py "Create a new image with the following specifications: From Image 1 (Character): - Use the exact character design and features - Maintain clothing and accessories. From Image 2 (Environment): - Use the mystical forest setting - Keep the composition and depth. From Image 3 (Style): - Apply the Studio Ghibli-like animation style - Use the warm, soft color palette - Apply the characteristic lighting and atmosphere. The character from Image 1 should be walking through the forest from Image 2, all rendered in the beautiful animation style of Image 3. Position: Character in center-left, walking into the scene. Expression: Wonder and curiosity" --ref character_sheet_yuki.png forest_photo.png ghibli_style_reference.jpg --out ghibli_style_scene.png --ratio 16:9

### 4-3. ポーズ転写

python generate_image.py "Create a new image using: Image 1 (Character Identity): - Use this character's face, hair, and clothing. Image 2 (Pose Reference): - Match this exact pose and body position - Copy the arm positions and hand gestures - Maintain the camera angle. Keep the character from Image 1 but pose them exactly like Image 2. Match the dynamic energy and movement from the pose reference." --ref character_sheet_yuki.png action_pose.png --out character_with_pose.png --ratio 3:4


## セクション5: 実践プロジェクト

### Step 1: キャラクターシート生成（Kai）

python generate_image.py "Character design sheet for Kai, a young adventurer: Front view, side view, action pose. - 20 years old male - Messy brown hair with a single white streak - Warm amber eyes - Light tan skin with a small scar on chin - Wearing a dark green traveling cloak over brown leather armor - Carrying a worn backpack and a sword at hip. Fantasy RPG style, detailed illustration, white background." kai_base.png 3:2

### Step 2: 異なる環境に配置（森シーン）

python generate_image.py "Place the character from Image 1 into a new scene. Environment: dense magical forest with glowing mushrooms, misty atmosphere. Maintain exact character features from the reference: - Messy brown hair with white streak - Amber eyes - Green cloak and brown leather armor. The character should look like they belong in this environment. Match lighting to the scene naturally. Dynamic pose appropriate for the setting." --ref kai_base.png --out kai_forest.png --ratio 16:9

### Step 3: 異なるスタイルで描画（水彩スタイル）

python generate_image.py "Render the character from Image 1 in a new artistic style. Style: soft watercolor painting with visible brush strokes and paper texture. Maintain character identity and recognizable features. Apply the artistic style thoroughly." --ref kai_base.png --out kai_watercolor.png


## 参照画像について

### 事前準備で生成する画像（Module 06 事前準備）

| 参照画像名 | 説明 | 生成ステップ |
|-----------|------|-------------|
| `office_background.jpg` | オフィス背景 | Step 2 |
| `fantasy_forest.png` | ファンタジーの森 | Step 2 |
| `background.png` | 汎用背景 | Step 2 |
| `vangogh_style.jpg` | ゴッホ風スタイル参照 | Step 3 |
| `anime_style_reference.png` | アニメスタイル参照 | Step 3 |
| `ghibli_style_reference.jpg` | ジブリ風スタイル参照 | Step 3 |
| `action_pose.png` | アクションポーズ参照 | Step 4 |
| `forest_photo.png` | 森の写真 | Step 5 |
| `photo.jpg` | サンプル写真（任意） | Step 6 |
| `selfie.jpg` | サンプルセルフィー（任意） | Step 6 |

### Module 05で生成する画像

| 参照画像名 | 説明 | 生成場所 |
|-----------|------|----------|
| `character_sheet_yuki.png` | Yukiのキャラクターシート | Module 05 セクション2-2 |

### Module 06内で生成する画像

| 参照画像名 | 説明 | 生成場所 |
|-----------|------|----------|
| `kai_base.png` | Kaiのキャラクターシート | セクション5 Step 1 |
