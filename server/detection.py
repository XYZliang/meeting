import requests
import subprocess
import time
import re

index = False
now = time.strftime("%Y-%m-%d-%H:%M:%S", time.localtime())
filename = "/home/ubuntu/meeting/log/py/log" + now + '.txt'
errorfilename = "/home/ubuntu/meeting/log/py/error/log" + now + '.txt'
f = open(filename, 'w')
OK = True

def tryindex():
    url = "https://order.jxufesoftware.club:8000/api/meeting/follow/rooms"
    body = {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.2(0x18000236) NetType/WIFI Language/zh_CN",
    }
    try:
        f.write("\n"+"发送请求")
        req = requests.get(url=url, headers=body)
    except:
        return False
    if "需要登录" in req.text:
        return True
    else:
        return False


def killport():
    tuntime=0
    f.write("\n"+"尝试获取端口")
    command = "sudo netstat -anp |grep 8000 | grep python3"
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    port = ""
    for line in p.stdout.readlines():
        port += line.decode()
    retval = p.wait()
    if "python3" not in port:
        f.write("\n"+"端口不存在")
        return False
    f.write("\n"+"端口获取成功" + port)
    pattern = re.compile(r'\w+/python3')
    result = pattern.findall(port)
    for b in result:
        pyport = re.sub('/python3', "", b)
        print(b)
        killcommand = "sudo kill -9 " + pyport
        f.write("\n"+killcommand)
        pp = subprocess.Popen(killcommand, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        end = ""
        for line in pp.stdout.readlines():
            end += line.decode()
        retval1 = pp.wait()
        f.write("\n"+"执行杀掉" + end)
        tuntime+=1
        if tuntime > 10:
            f.write("\n" + "超时")
            return False
    return True


def movelog():
    command = "sudo cp /home/ubuntu/meeting/log.txt /home/ubuntu/meeting/log/" + now + ".txt"
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    re = ""
    for line in p.stdout.readlines():
        re += line.decode()
    retval = p.wait()
    f.write("\n"+"移动日志" + re)


def restart():
    command = "cd /home/ubuntu/meeting && nohup python3 manage.py runserver_plus 0.0.0.0:8000 --cert 1_order.jxufesoftware.club_bundle.crt --key-file 2_order.jxufesoftware.club.key > log.txt 2>&1 &"
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    re = ""
    for line in p.stdout.readlines():
        re += line.decode()
    retval = p.wait()
    f.write("\n"+"重启命令发送" + re)

def makelog():
    command = "sudo mv "+filename+" "+errorfilename
    if index:
        f.write("\n"+"日志移动"+command)
    f.write("\n"+"程序退出")
    f.close()
    if index:
        p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        re = ""
        for line in p.stdout.readlines():
            re += line.decode()
        retval = p.wait()

if __name__ == '__main__':
    index = tryindex()
    if index:
        f.write("\n"+"连接成功")
    else:
        f.write("\n"+"连接失败，重试")
        index = tryindex()
        if index:
            f.write("\n"+"重试成功")
        else:
            f.write("\n"+"连接失败，尝试重启")
    if index:
        f.write("\n"+"服务器OK")
        exit(1)
    else:
        f.write("\n"+"开始重启")
    killport()
    movelog()
    restart()
    makelog()
