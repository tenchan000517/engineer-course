from flask import Flask, request, jsonify
import tweepy
import os
from dotenv import load_dotenv

# .envファイルから環境変数を読み込み
load_dotenv()

app = Flask(__name__)

# ====== 環境変数から認証情報を取得 ======
API_KEY = os.getenv("X_API_KEY")
API_SECRET = os.getenv("X_API_SECRET")
ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET")
# ========================================

# Twitterクライアント
client = tweepy.Client(
    consumer_key=API_KEY,
    consumer_secret=API_SECRET,
    access_token=ACCESS_TOKEN,
    access_token_secret=ACCESS_TOKEN_SECRET
)

@app.route('/post', methods=['POST'])
def post_tweet():
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

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("X API Server starting on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000)
