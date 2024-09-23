# app.py
from flask import Flask, render_template, jsonify
import requests
import datetime

app = Flask(__name__)

# 监控的四台机器的 IP 地址及其 /status 路径
MONITORED_MACHINES = [
    "http://172.18.131.2:5000/status",
    "http://172.18.131.4:5000/status",
    "http://172.18.131.6:5000/status",
    "http://172.18.131.8:5000/status"
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/status', methods=['GET'])
def gather_status():
    statuses = {}
    errors = []
    # 遍历四台待监控的机器
    for url in MONITORED_MACHINES:
        try:
            # 请求 GPU 状态
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                statuses[url] = response.json()  # 解析 JSON 响应
            else:
                errors.append(f"无法从 {url} 获取数据 (状态码 {response.status_code})")
        except Exception as e:
            errors.append(f"连接 {url} 时出错: {e}")

    # 返回汇总的数据
    return jsonify({
        "datetime_str": datetime.datetime.now().strftime("%a %b %d %H:%M:%S %Y"),
        "statuses": statuses,
        "errors": errors
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
