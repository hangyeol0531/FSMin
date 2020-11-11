import sys
import os
# a = 5
# mod = sys.modules[__name__]
# for i in range(0,a):
    # setattr(mod, 'var_{}'.format(i), i)

# print(var_0)
# print(var_1)
# print(var_2)
# print(var_3)


def getFileData(dataDirectory, fileName):
    with open(os.path.join(dataDirectory, fileName), 'rb') as file:
        data = file.read(int(getFileSize(dataDirectory, fileName)))
        return data

def getFileSize(dataDirectory, fileName):
    fileSize = os.path.getsize(os.path.join(dataDirectory, fileName))
    return str(fileSize).encode()

def add_file():
    with open('sample.txt', 'wt', encoding='utf8') as file:
        file.write(decoded)

byte_str = getFileData('C:\\Users\\dhtkd\\Documents\\GitHub\\FSM_in', 'test.txt')
byte_size = getFileSize('C:\\Users\\dhtkd\\Documents\\GitHub\\FSM_in', 'test.txt')

# print("byte 값 : {0}\nbyte 크기 {1}".format(byte_str, byte_size))

num = int(input("나눌 개수를 입력하세요 : "))
a = int(len(byte_str)/num)

def txt_split():
    if num >= 1:
        for value in range(0,a+1):
            temp1 = byte_str[:value]
        decoded = (temp1).decode('utf-8')
        print(temp1)
    if num >= 2:
        for value in range(0,a+1):
            temp2 = byte_str[value:value*2]
        decoded = (temp1+temp2).decode('utf-8')
        print(temp2)
    if num >=3:
        for value in range(0,a+1):
            temp3 = byte_str[value*2:]
        decoded = (temp1+temp2+temp3).decode('utf-8')
        print(temp3)
    return decoded

decoded = txt_split()

decoded = decoded.replace("\n", "")

add_file()