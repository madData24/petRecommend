from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/breedRecommend', methods=['POST'])
def breed_recommend():
    data = request.json
    # Process the data...
    # For example, you might be processing breed recommendation logic here

    return jsonify({"message": "PYTHON API SUCCESSFUL!", "data": data})
