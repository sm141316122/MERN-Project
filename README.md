# MERN專案 - 學習系統網站
此為MERN (MongoDB、Express(js)、React(js)、Node(js))專案練習，主要為練習React以Axios串接RESTful API取得資料庫資料，所以CSS皆套用Bootstrap。
前端使用React，以State抓取狀態(如當前使用者、輸入的資訊)、Effect在進入課程頁面時顯示不同資訊、使用Navigate轉跳頁面。
後端使用Express(js)製作RESTful API，MongoDB為資料庫，使用JWT套件記錄登入的使用者資訊，並用passport套件來驗證

# DEMO

### 註冊用戶，以註冊學生示範

https://github.com/sm141316122/MERN-Project/assets/126851722/07d82196-bc73-41ef-9aba-5f1a4f60cee1

### 以學生身分登入，搜尋課程並註冊，查看已註冊的課程

https://github.com/sm141316122/MERN-Project/assets/126851722/6fe0a30a-df08-4d1b-b2f8-431bf28e889f

### 以講師身分登入，可發布新課程，查看此用戶發布的課程

https://github.com/sm141316122/MERN-Project/assets/126851722/2a67c8b9-ae7a-4235-8908-8dfc046e21c1

# 專案使用技術
- React
- React-Router-Dom
- State 抓取狀態
- Effect 進入頁面時顯示不同資訊
- Navigate 轉跳頁面
- Axios 串接後端
- CSS Bootstrap
- RESTful API (Express) 註冊、登入、查看課程、註冊課程、發布課程等功能
- JWT 記錄登入使用者資訊
- passport 使用此套件來驗證JWT
- MongoDB

# 套件

### Client

- axios
- react
- react-router-dom

### Server

- bcrypt
- cors
- dotenv
- express
- joi
- jsonwebtoken
- mongoose
- passport
- passport-jwt
- passport-local
