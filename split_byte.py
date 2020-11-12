import sys
import os

def getFileData(dataDirectory, fileName): # 입력받는 텍스트 파일 값 byte로 변환하여 불러오기
    with open(os.path.join(dataDirectory, fileName), 'rb') as file:
        data = file.read(int(getFileSize(dataDirectory, fileName)))
        return data

def getFileSize(dataDirectory, fileName): # 입력받는 텍스트 파일 byte 크기 불러오기
    fileSize = os.path.getsize(os.path.join(dataDirectory, fileName))
    return str(fileSize).encode()

byte_str = getFileData('C:\\Users\\dhtkd\\Documents\\GitHub\\FSM_in', 'test.txt') # 불러온 byte 저장
byte_size = getFileSize('C:\\Users\\dhtkd\\Documents\\GitHub\\FSM_in', 'test.txt') # 불러온 byte 크기 저장

print("byte 값 : {0}\nbyte 크기 {1}".format(byte_str, byte_size)) # byte 값과 크기 출력

num = int(input("나눌 개수를 입력하세요 : ")) # byte값을 몇 개로 나눌건지 num으로 입력 (몇등분 할지 입력받음)
byte_str += b' ' * (num - len(byte_str)%num)
a = int(len(byte_str)/num) # byte값을 길이로 나눔 a = byte크기/num값 ex). byte 크기 = 60, num값 = 3 이라면 60/3 = 20 = a

datas = []  # 나눈 byte값을 리스트형식으로 저장하는 datas(리스트) 변수
def txt_split(num): # 몇 개로 나눌지 값을 받앙옴
    for i in range(0,num): # 0~ 나누는 값 -1번 반복
        datas.append(byte_str[(a*i):a*(i+1)]) # datas[]에 나눈 값들을 차례대로 0번방부터 num-1번방까지 추가하기
    return datas    # datas값 반환 (리트스형식이며 안에 값은 byte로 나타남)

result = txt_split(num) # result는 txt_split 함수 기능 가능

print(result)

fuck = "" # temp=""
osm = [] # b=[]


for i in result: # result = a[]
    print(i)
    fuck += i.decode('utf-8')
print(fuck)

fuck = fuck.replace("\n","")

def add_file():
    with open('sample.txt', 'wt', encoding='utf8') as file:
        file.write(fuck)



add_file()