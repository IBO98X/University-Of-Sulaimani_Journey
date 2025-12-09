import cv2
import numpy as np

# read and copy the image

# img = cv2.imread("C:\\Universty Projects\\imgs\\50x50_gold_front.jpg")
# cv2.imshow("Origin Image", img)
# cv2.waitKey(0)
# cv2.imwrite("C:\\Universty Projects\\imgs\\azeez.jpg",img)
# cv2.waitKey(0)

# video

# vid = cv2.VideoCapture("C:\\Universty Projects\\imgs\\dd.mp4")
# fps = vid.get(cv2.CAP_PROP_FPS)
# print("frame rate:", int(fps),"fps")
# while True:
#     success, img = vid.read()
#     cv2.imshow("video", img)
#     if cv2.waitKey(4) == ord('s'):
#         break
#     vid.release()
#     cv2.destroyAllWindows()

# grey color

# img = cv2.imread("C:\\Universty Projects\\imgs\\50x50_gold_front.jpg")
# imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# cv2.imshow("Gray Image", imgGray)
# cv2.waitKey(0)

# blure

# img = cv2.imread("C:\\Universty Projects\\imgs\\50x50_gold_front.jpg")
# blure = cv2.GaussianBlur(img,(9,9),0)
# cv2.imshow("img",img)
# cv2.imshow("blure img", blure)
# cv2.waitKey(0)

# canny

# img = cv2.imread("C:\\Universty Projects\\imgs\\50x50_gold_front.jpg")
# canny =cv2.Canny(img,100,100)
# cv2.imshow("img",img)
# cv2.imshow("after",canny)
# cv2.waitKey(0)

# kernal

# img = cv2.imread("C:\\Universty Projects\\imgs\\50x50_gold_front.jpg")
# kernel = np.ones((5, 5), int)
# cyann = cv2.Canny(img, 150, 200)
# dilation = cv2.dilate(canny, kernel, iterations=1)
# cv2.imshow("Original Image", img)
# cv2.imshow("Canny Image", canny)
# cv2.imshow("Dilation Image", dilation)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# erosion

# img = cv2.imread("C:\\Universty Projects\\imgs\\50x50_gold_front.jpg")
# kernel = np.ones((5, 5), int)
# canny = cv2.Canny(img, 150, 200)
# dilation = cv2.dilate(canny, kernel, iterations=1)
# erotion = cv2.erode(dilation, kernel, iterations=1)
# cv2.imshow("origin Image", img)
# cv2.imshow("canny Image", canny)
# cv2.imshow("dilation Image", dilation)
# cv2.imshow("eroded Image", erotion)
# cv2.waitKey(0)

# long video code

# vid = cv2.VideoCapture("Resourses/boat.mp4")
# frame_width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
# frame_height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
# fps = int(vid.get(cv2.CAP_PROP_FPS))
# fourcc = cv2.VideoWriter_fourcc('m', 'p', '4', 'v')
# output = cv2.VideoWriter('C:/Users/Click/Desktop/output.mp4', fourcc, fps, (frame_width, frame_height))

# while True:
#     success, frame = vid.read()
#     cv2.imshow("frame", frame)
#     output.write(frame)
#     if cv2.waitKey(20) == ord('s'):
#         break


# lab 

# img = cv2.imread("C:\\Universty Projects\\imgs\\2.jpeg")
# print(img.shape)
# cv2.imshow("output", img)
# imgcropped = img[0:200, 200:500]
# cv2.imshow("cropped", imgcropped)
# print("aftaer cropped", imgcropped)
# cv2.waitKey(0)


# lab 2

# img1 = cv2.imread("C:\\Universty Projects\\imgs\\2.jpeg")
# img2 = cv2.imread("C:\\Universty Projects\\imgs\\2.jpeg")
# imHor = np.hstack((img1,img2))
# imVer = np.vstack((img1,img2))
# cv2.imshow("horizantal", imHor)
# cv2.imshow("vertical", imVer)
# cv2.imwrite("C:\\Universty Projects\\imgs.png", imHor)
# cv2.waitKey(0)

# example 3

# img1 = cv2.imread("C:\\Universty Projects\\imgs\\2.jpg")
# img2 = cv2.imread("C:\\Universty Projects\\imgs\\1.jpeg")
# dst = cv2.addWeighted(img1, 0.7, img2, 0.6, 0)
# cv2.imshow("Image 1", img1)
# cv2.imshow("Image 2", img2)
# cv2.imshow("Blended Image", dst)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# example 4

# img1 = cv2.imread("C:\\Universty Projects\\imgs\\2.jpg")
# img2 = cv2.imread("C:\\Universty Projects\\imgs\\1.jpeg")
# result_image = cv2.subtract(img1, img2)
# cv2.imshow("Subtracted Image", result_image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# example 5

# img1 = cv2.imread("C:\\Universty Projects\\imgs\\ibo98x.jpg")
# img2 = cv2.imread("C:\\Universty Projects\\imgs\\1.jpeg")
# multi_image = cv2.multiply(img1, img2)
# cv2.imshow("multyplyed Image", multi_image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# example 6

# img1 = cv2.imread("C:\\Universty Projects\\imgs\\ibo98x.jpg")
# img2 = cv2.imread("C:\\Universty Projects\\imgs\\1.jpeg")
# bitwise_and = cv2.bitwise_and(img2, img1)
# cv2.imshow("star", img1)
# cv2.imshow("circle", img2)
# cv2.imshow("bit_and", bitwise_and)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# example 7

# img1 = cv2.imread("C:\\Universty Projects\\imgs\\ibo98x.jpg")
# img2 = cv2.imread("C:\\Universty Projects\\imgs\\1.jpeg")
# bitwise_and = cv2.bitwise_and(img2, img1)
# bitwise_and_or = cv2.bitwise_or(img2, img1)
# bitwise_and_xor = cv2.bitwise_xor(img2, img1)
# cv2.imshow("star", img1)
# cv2.imshow("circle", img2)
# cv2.imshow("bit_and", bitwise_and)
# cv2.imshow("bit_and", bitwise_and_or)
# cv2.imshow("bit_and", bitwise_and_xor)
# cv2.waitKey(0)
# cv2.destroyAllWindows()