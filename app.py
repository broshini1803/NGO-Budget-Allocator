from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

def merge_sort(projects):
    if len(projects) <= 1:
        return projects

    mid = len(projects) // 2
    left = merge_sort(projects[:mid])
    right = merge_sort(projects[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    while left and right:
        if left[0]['impact'] >= right[0]['impact']:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
    result.extend(left or right)
    return result

@app.route("/merge-sort", methods=["POST"])
def sort_projects():
    data = request.get_json()
    if isinstance(data, list):
        projects = data
    elif isinstance(data, dict) and "projects" in data:
        projects = data["projects"]
    else:
        return jsonify({"error": "Invalid input format"}), 400

    sorted_projects = merge_sort(projects)
    return jsonify(sorted_projects)

@app.route('/knapsack', methods=['POST'])
def knapsack_solver():
    data = request.json
    projects = data['projects']
    budget = int(data['budget'])

    n = len(projects)
    dp = [[0] * (budget + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(budget + 1):
            cost = int(projects[i - 1]['cost'])
            impact = int(projects[i - 1]['impact'])
            if cost <= w:
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - cost] + impact)
            else:
                dp[i][w] = dp[i - 1][w]

    w = budget
    selected = []
    total_cost = 0
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(projects[i - 1])
            total_cost += int(projects[i - 1]['cost'])
            w -= int(projects[i - 1]['cost'])

    return jsonify({
        'selected_projects': selected[::-1],
        'total_impact': dp[n][budget],
        'total_cost': total_cost
    })

if __name__ == '__main__':
    app.run(debug=True)
