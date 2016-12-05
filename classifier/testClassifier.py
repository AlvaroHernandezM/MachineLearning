import json
from os.path import join, dirname
from os import environ
from watson_developer_cloud import VisualRecognitionV3 as VisualRecognition
#31e589a7ae4990a6261e68d8b2931acf5145b973 - alvaro - junto
#37ff1e95c9da3f5e5161d6f49b0139469c087f8d . watsonR - separados
visual_recognition = VisualRecognition('2016-05-20', api_key='37ff1e95c9da3f5e5161d6f49b0139469c087f8d')

data = json.loads(json.dumps(visual_recognition.classify(owners="me",images_url="https://scontent-mia1-2.xx.fbcdn.net/v/t34.0-12/15327550_10211547072255521_2026008890_n.jpg?oh=de2807a23063390a95628815543e73e9&oe=5847146E"), indent=2))
#print data
if(len(data['images'][0]['classifiers'])>0):
	for i in data['images'][0]['classifiers'][0]['classes']:
		print i['class']+' = '+str(i['score'])
else:
	print 'no se ha punteado con ninguno de los valores de las dos clases'