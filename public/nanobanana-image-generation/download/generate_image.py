import os
import sys
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types

def generate_image(prompt, output_filename=None):
    """プロンプトから画像を生成する"""

    load_dotenv()
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

    print(f"プロンプト: {prompt}")
    print("生成中...")

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=['IMAGE']
        )
    )

    for part in response.parts:
        if part.inline_data is not None:
            image = part.as_image()

            # ファイル名が指定されていなければタイムスタンプで生成
            if output_filename is None:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                output_filename = f"generated_{timestamp}.png"

            image.save(output_filename)
            print(f"画像を保存しました: {output_filename}")
            return output_filename

    print("画像の生成に失敗しました")
    return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使い方: python generate_image.py \"プロンプト\" [出力ファイル名]")
        print("例: python generate_image.py \"A cute cat\" cat.png")
        sys.exit(1)

    prompt = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else None

    generate_image(prompt, output)
