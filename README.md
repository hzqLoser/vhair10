
# HairMatch AI - 项目文档

## 1. 功能模块说明 (Feature Modules)

HairMatch AI 是一款面向年轻用户的 AI 虚拟换发 App。

### 1.1 首页 (Home / Hairstyle)
- **发型浏览**: 提供男士/女士发型切换，以及长发、短发、卷发等标签筛选。
- **发型详情**: 展示发型大图、热度、标签及详细描述。
- **试戴入口**: 引导用户进入 AI 试戴流程。

### 1.2 AI 智能试戴 (Try-On)
- **照片上传**: 支持上传本地照片或调用相机（Web端模拟）。
- **智能生成**: 调用 Gemini Nano Banana 模型生成发型试戴效果图。
- **结果展示**: 提供试戴前后对比，支持保存、分享、重新生成。
- **一键咨询**: 试戴满意后可直接将效果图发送给门店或发型师。

### 1.3 广场 (Square)
- **话题**: 展示社区热门话题及参与人数。
- **发友秀**: 展示真实用户的 AI 试戴效果与落地效果对比。
- **门店精选**: 推荐附近的优质理发店，支持查看评分、价格并预约。

### 1.4 消息 (Messages)
- **咨询列表**: 用户与门店/发型师的沟通记录。
- **系统通知**: 预约状态、AI 生成完成通知等。
- **聊天功能**: 支持发送文本，系统会自动发送试戴对比卡片。

### 1.5 个人中心 (Me)
- **我的资产**: 试戴历史记录、收藏的发型、收藏的门店。
- **用户数据**: 试戴次数、AI 额度统计。
- **帮助与支持**: 常见问题解答与联系方式。

---

## 2. 前后端接口协议 (API Protocols)

本项目前端采用 React 开发，所有数据交互已封装在 `services/api.ts` 中。后端建议采用 Go 语言实现。

以下是主要接口的定义与字段说明。

### 2.1 获取发型列表
* **Method**: `GET /api/hairstyles`
* **Query Params**:
  * `gender`: string (可选, 'Male' | 'Female')
  * `category`: string (可选, 'long' | 'short' | 'curly'...)
* **Response**: `Hairstyle[]`
```json
[
  {
    "id": "h1",
    "name": "空气感中卷",
    "imageUrl": "https://...",
    "tags": ["圆脸", "学生党"],
    "gender": "Female",
    "category": "curly",
    "heat": 1200,
    "isCollected": false,
    "description": "整体轻盈蓬松..."
  }
]
```

### 2.2 获取门店列表
* **Method**: `GET /api/stores`
* **Response**: `Store[]`
```json
[
  {
    "id": "s1",
    "name": "震轩美发沙龙",
    "imageUrl": "https://...",
    "rating": 4.9,
    "price": 120,
    "distance": "1.2km",
    "tags": ["烫染专长"],
    "description": "资深发型师...",
    "isBookable": true
  }
]
```

### 2.3 AI 试戴生成
* **Method**: `POST /api/generate`
* **Body**:
  * `originalImage`: string (Base64 编码的图片字符串)
  * `prompt`: string (发型描述提示词)
* **Response**:
```json
{
  "resultUrl": "https://.../generated_image.png", // 或 Base64
  "status": "success"
}
```

### 2.4 获取用户历史记录
* **Method**: `GET /api/user/history`
* **Response**: `TryOnHistoryItem[]`
```json
[
  {
    "id": "hist1",
    "date": "2023-10-24",
    "hairstyleName": "法式蛋卷头",
    "imageUrl": "https://..."
  }
]
```

### 2.5 保存历史记录
* **Method**: `POST /api/user/history`
* **Body**:
  * `hairstyleName`: string
  * `imageUrl`: string
* **Response**:
```json
{ "success": true, "id": "new_history_id" }
```

### 2.6 发送消息
* **Method**: `POST /api/chat/send`
* **Body**:
  * `sessionId`: string (目标门店或发型师ID)
  * `text`: string
* **Response**:
```json
{ "success": true }
```
