# QuestLearn

QuestLearn is a tool which utilizes Google Classroom to create a reward-based economy.

# Overview
QuestLearn will be hosted as a web application for use in online learning
- Usable by students and teachers
It will be accessible through two different portals
- Teachers connect to Google Classroom
  - Create a reward system
  - Create custom Quests (Assignments)
- Students connect through Google Classroom
  - They can gain currency called QuestCoin
  - QuestCoin is earned through completing assignments or goals
  - Can create a digital avatar which is customizable

# Stack
- Software Interfaces
- Google Classroom API - v1 and Google OAuth
- Google Cloud - v2.8.0
  - Google Cloud for storing data
  - Pub/Sub will be used to prevent querying the API repeatedly via a polling service; instead utilizing messaging system
- Mongo DB - 4.0
- Express.js - 4.17.1
- Angular - 10.0.0
- Node.js - 14.15.5

# Sequence Diagram
# # User registration
![image](https://user-images.githubusercontent.com/47586117/217311387-1157e884-075b-4913-8b7e-ebdc660afefe.png)

# # Classroom Service
![image](https://user-images.githubusercontent.com/47586117/217311525-42933358-9e90-489b-b023-92db50d1e06b.png)

# # Shop Service
![image](https://user-images.githubusercontent.com/47586117/217311649-af45298b-d4c0-4320-861a-e4e77f3256f6.png)
 
 
 # Full report
 Our full final report, with code analyis and more diagrams, can be found [here](https://docs.google.com/document/d/e/2PACX-1vQ7s2RoVWLkw7Zqiy9Ou27qA5EGEISkCP8zd5YE2UXe4rpycixO0ENRoU_MRkzNKXVT7FYL32_tIFWx/pub).
