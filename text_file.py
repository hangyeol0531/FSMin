import sys
import os

def getFileData(dataDirectory): # 입력받는 텍스트 파일 값 byte로 변환하여 불러오기
    with open(os.path.join(dataDirectory), 'rb') as file:
        data = file.read(int(getFileSize(dataDirectory)))
        return data

def getFileSize(dataDirectory): # 입력받는 텍스트 파일 byte 크기 불러오기
    fileSize = os.path.getsize(os.path.join(dataDirectory))
    return str(fileSize).encode()

# txt_name = input("값을 읽어올 파일명을 입력하세요 : ") # 값을 읽어올 파일명을 입력받는 변수
ori_name = input("값을 불러올 파일명을 입력하세요 : ") # 값을 불러올 파일명을 입력받는 변수
create_name = input("값을 저장할 파일명을 입력하세요 : ") # 값을 저장할 파일명을 입력받는 변수

byte_str = getFileData(ori_name) # 불러온 byte 저장
byte_size = getFileSize(ori_name) # 불러온 byte 크기 저장

print("byte 값 : {0}\nbyte 크기 {1}".format(byte_str, byte_size)) # byte 값과 크기 출력

num_split = int(input("나눌 개수를 입력하세요 : ")) # byte값을 몇 개로 나눌건지 num_split으로 입력 (몇등분 할지 입력받음)
byte_str += b' ' * (num_split - len(byte_str)%num_split)
byte_length = int(len(byte_str)/num_split) # byte값을 길이로 나눔 byte_length = byte크기/num_split값 ex). byte 크기 = 60, num_split값 = 3 이라면 60/3 = 20 = byte_length

filename = ""
list_datas = []  # 나눈 byte값을 리스트형식으로 저장하는 list_datas(리스트) 변수
def txt_split(num_split): # 몇 개로 나눌지 값을 받아옴
    for i in range(0,num_split): # 0~ 나누는 값 -1번 반복
        list_datas.append(byte_str[(byte_length*i):byte_length*(i+1)]) # list_datas[]에 나눈 값들을 차례대로 0번방부터 num_split-1번방까지 추가하기
    return list_datas    # list_datas값 반환 (리트스형식이며 안에 값은 byte로 나타남)

result_split = txt_split(num_split) # result_split는 txt_split 함수 기능 가능

result_merge = "" # temp=""

for i in result_split: # result_split = a[]
    result_merge += i.decode('utf-8')
print(result_merge)

result_merge = result_merge.replace("\n","")

def add_file():
    with open(create_name, 'w', encoding='utf8') as file:
        file.write(result_merge)


add_file()