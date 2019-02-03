from flask import Flask, request, jsonify
from sklearn.neighbors import KNeighborsClassifier
import requests, json, math
app = Flask(__name__)

@app.route('/info', methods=['POST'])
def getInfo():
        data = request.get_json()

        startpos = (data['latitude'] * 111 * 150, data['longitude'] * 111 * 150)

        trainingData = []
        labels = []
        for restaurant in data['allRestaurants']:
                print(restaurant)
                print()
                name = restaurant['name']
                address = restaurant['location']['address1']
                coords = (restaurant['coordinates']['latitude'] * 111 * 150, restaurant['coordinates']['longitude'] * 111 * 150) # in metres
                dist = math
                rating = restaurant['rating']**3 # 1-5
                # foodType = restaurant['categories']['title']
                # price = len(restaurant['price']) # 1-4

                # trainingData.append([location[0], location[1], rating, price])
                trainingData.append([coords[0], coords[1], rating])
                labels.append([name, address])

        classifier = KNeighborsClassifier(weights='distance', n_neighbors=1)
        model = classifier.fit(trainingData, labels)

        # result = model.predict([[startpos[0], startpos[1], 5, 2]])
        result = model.predict([[startpos[0], startpos[1], 5**3]])
        print(result)
        print()

        return jsonify(list(result[0]))

if __name__ == '__main__':
        app.run(host='0.0.0.0')
