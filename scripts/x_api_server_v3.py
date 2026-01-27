from flask import Flask, request, jsonify
import tweepy
import os
import base64
import tempfile
from dotenv import load_dotenv
from google import genai
from google.genai import types

# .envファイルから環境変数を読み込み
load_dotenv()

app = Flask(__name__)

# ====== 環境変数から認証情報を取得 ======
API_KEY = os.getenv("X_API_KEY")
API_SECRET = os.getenv("X_API_SECRET")
ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# ========================================

# Twitter/X クライアント（v2 API）
client = tweepy.Client(
    consumer_key=API_KEY,
    consumer_secret=API_SECRET,
    access_token=ACCESS_TOKEN,
    access_token_secret=ACCESS_TOKEN_SECRET
)

# Twitter/X API v1.1（画像アップロード用）
auth = tweepy.OAuth1UserHandler(
    API_KEY, API_SECRET,
    ACCESS_TOKEN, ACCESS_TOKEN_SECRET
)
api_v1 = tweepy.API(auth)

# Gemini クライアント
genai_client = genai.Client(api_key=GOOGLE_API_KEY)


@app.route('/post', methods=['POST'])
def post_tweet():
    """単一ツイート投稿"""
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'text is required'}), 400

        response = client.create_tweet(text=text)
        tweet_id = response.data['id']

        return jsonify({
            'success': True,
            'tweet_id': tweet_id,
            'text': text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/thread', methods=['POST'])
def post_thread():
    """スレッド投稿（image_promptがあれば1ツイート目に画像付き）"""
    try:
        data = request.get_json()
        tweets = data.get('tweets', [])
        image_prompt = data.get('image_prompt', '')

        if not tweets or len(tweets) == 0:
            return jsonify({'error': 'tweets array is required'}), 400

        media_id = None

        # image_promptがあれば画像生成
        if image_prompt:
            gen_response = genai_client.models.generate_content(
                model="gemini-3-pro-image-preview",
                contents=image_prompt,
                config=types.GenerateContentConfig(
                    response_modalities=['IMAGE'],
                    image_config=types.ImageConfig(aspect_ratio='1:1')
                )
            )

            image_data = None
            for part in gen_response.candidates[0].content.parts:
                if part.inline_data is not None:
                    image_data = part.inline_data.data
                    break

            if image_data:
                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
                    tmp_file.write(image_data)
                    tmp_path = tmp_file.name

                try:
                    media = api_v1.media_upload(filename=tmp_path)
                    media_id = media.media_id
                finally:
                    os.unlink(tmp_path)

        results = []
        previous_tweet_id = None

        for i, tweet_text in enumerate(tweets):
            if i == 0 and media_id:
                # 1ツイート目: 画像付き
                response = client.create_tweet(
                    text=tweet_text,
                    media_ids=[media_id]
                )
            elif previous_tweet_id:
                # 2ツイート目以降: リプライ
                response = client.create_tweet(
                    text=tweet_text,
                    in_reply_to_tweet_id=previous_tweet_id
                )
            else:
                response = client.create_tweet(text=tweet_text)

            tweet_id = response.data['id']
            previous_tweet_id = tweet_id
            results.append({
                'index': i + 1,
                'tweet_id': tweet_id,
                'text': tweet_text,
                'has_image': i == 0 and media_id is not None
            })

        first_tweet_id = results[0]['tweet_id'] if results else None

        response_data = {
            'success': True,
            'tweet_id': first_tweet_id,
            'thread_count': len(results),
            'tweets': results
        }
        if media_id:
            response_data['media_id'] = str(media_id)

        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/generate-image', methods=['POST'])
def generate_image():
    """Nanobanana（Gemini）で画像生成"""
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        aspect_ratio = data.get('aspect_ratio', '1:1')

        if not prompt:
            return jsonify({'error': 'prompt is required'}), 400

        # 有効なアスペクト比
        valid_ratios = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']
        if aspect_ratio not in valid_ratios:
            aspect_ratio = '1:1'

        # Nanobanana（Gemini）で画像生成
        response = genai_client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE'],
                image_config=types.ImageConfig(aspect_ratio=aspect_ratio)
            )
        )

        # 画像データを取得
        image_data = None
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                break

        if not image_data:
            return jsonify({'error': 'No image generated'}), 500

        # Base64エンコード
        image_base64 = base64.b64encode(image_data).decode('utf-8')

        return jsonify({
            'success': True,
            'image_base64': image_base64,
            'prompt': prompt,
            'aspect_ratio': aspect_ratio
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/post-with-image', methods=['POST'])
def post_with_image():
    """画像付きツイート投稿"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        image_base64 = data.get('image_base64', '')

        if not text:
            return jsonify({'error': 'text is required'}), 400
        if not image_base64:
            return jsonify({'error': 'image_base64 is required'}), 400

        # Base64デコードして一時ファイルに保存
        image_data = base64.b64decode(image_base64)

        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
            tmp_file.write(image_data)
            tmp_path = tmp_file.name

        try:
            # 画像をアップロード（API v1.1）
            media = api_v1.media_upload(filename=tmp_path)
            media_id = media.media_id

            # 画像付きツイートを投稿（API v2）
            response = client.create_tweet(
                text=text,
                media_ids=[media_id]
            )
            tweet_id = response.data['id']

            return jsonify({
                'success': True,
                'tweet_id': tweet_id,
                'text': text,
                'media_id': str(media_id)
            })
        finally:
            # 一時ファイルを削除
            os.unlink(tmp_path)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/generate-and-post', methods=['POST'])
def generate_and_post():
    """画像生成 + 投稿を一括実行"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        prompt = data.get('prompt', '')
        aspect_ratio = data.get('aspect_ratio', '1:1')

        if not text:
            return jsonify({'error': 'text is required'}), 400
        if not prompt:
            return jsonify({'error': 'prompt is required'}), 400

        # 有効なアスペクト比
        valid_ratios = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']
        if aspect_ratio not in valid_ratios:
            aspect_ratio = '1:1'

        # 1. 画像生成
        response = genai_client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE'],
                image_config=types.ImageConfig(aspect_ratio=aspect_ratio)
            )
        )

        image_data = None
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                break

        if not image_data:
            return jsonify({'error': 'No image generated'}), 500

        # 2. 一時ファイルに保存
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
            tmp_file.write(image_data)
            tmp_path = tmp_file.name

        try:
            # 3. 画像アップロード（API v1.1）
            media = api_v1.media_upload(filename=tmp_path)
            media_id = media.media_id

            # 4. 画像付き投稿（API v2）
            response = client.create_tweet(
                text=text,
                media_ids=[media_id]
            )
            tweet_id = response.data['id']

            return jsonify({
                'success': True,
                'tweet_id': tweet_id,
                'text': text,
                'prompt': prompt,
                'aspect_ratio': aspect_ratio,
                'media_id': str(media_id)
            })
        finally:
            os.unlink(tmp_path)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'version': 'v3'})


if __name__ == '__main__':
    print("X API Server v3 starting on http://localhost:5000")
    print("Endpoints:")
    print("  POST /post              - 単一ツイート投稿")
    print("  POST /thread            - スレッド投稿（image_promptあれば画像付き）")
    print("  POST /generate-image    - 画像生成（Nanobanana）")
    print("  POST /post-with-image   - 画像付きツイート投稿")
    print("  POST /generate-and-post - 画像生成+投稿を一括実行")
    print("  GET  /health            - ヘルスチェック")
    app.run(host='0.0.0.0', port=5000)
