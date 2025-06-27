# 🛠️ Development Log: FitTracker Pro: An AWS-based Minimal Gym Progress Tracker by Abel Gutierrez

http://abel-gym-progress-app.s3-website-us-east-1.amazonaws.com/

---

## 💡 Project Overview

- Goal: Build a personal workout tracking web app using AWS Lambda, API Gateway, and DynamoDB.
- Features:
  - Submit workout data (user, exercise, sets, reps, timestamp, notes)
  - View workout history filtered by date
  - Simple, clean frontend hosted on Amazon S3

---

## 🧱 Tech Stack

| Component        | Stack Used                                    |
|------------------|-----------------------------------------------|
| Frontend         | HTML, CSS, JavaScript (S3-hosted static site) |
| Backend          | AWS Lambda (Python)                           |
| API              | API Gateway (HTTP API)                        |
| Database         | DynamoDB (user_id as partition key)           |
| Logging & Debug  | CloudWatch Logs, ChatGPT prompting            |

---

## 🔄 Workflow Summary

### ✅ Phase 1: Static Website Setup
- Enabled static website hosting in S3
- Uploaded index.html, style.css, and script.js
- Used Fetch API for form submission

### ✅ Phase 2: Lambda Function (POST Workout)
- Parsed JSON body
- Validated required fields
- Wrote item to DynamoDB
- Returned CORS headers

### ✅ Phase 3: Lambda Function (GET Workout)
- Queried DynamoDB for workouts by user_id
- Sorted by timestamp
- Serialized Decimal values safely
- Returned JSON response with CORS headers

### ✅ Phase 4: API Gateway Integration
- Created HTTP API with POST and GET /workout routes
- Integrated with Lambda using Lambda proxy integration
- Ensured CORS headers returned on all responses

### ✅ Phase 5: Frontend Logic
- Used Fetch API to POST workout data
- Displayed confirmation or error message
- Fetched workouts using GET
- Rendered them to the DOM

---

## 🔍 Key Fixes & Learnings

- ❌ Initial CORS issues: Fixed by adding headers in Lambda response
- ❌ Decimal serialization error: Resolved by casting Decimal → float/str
- ❌ Method not allowed (405): Diagnosed route vs. method mismatch in API Gateway
- ❌ Implementing both GET and POST methods in my Lambda code proved way harder than initially anticipated.
- ✅ Added date-based dropdown filter using JS Set and DOM manipulation
- ✅ Created dynamic event listener instead of inline onclick

---

## 📆 Final Feature: View by Date

Implemented a dropdown that filters workouts by unique workout date. On "View My Workouts" button press:

- Dynamically loads dropdown with available workout dates
- Shows workouts only for selected date
- Dropdown is hidden unless workouts are found

---

## 📂 File Structure

FitTracker-Pro/
├── index.html
├── style.css
├── script.js
└── lambda_function.py

---

## 🔍 Future Plans:

For my next iteration of this evolving project, here are my plans, as this is for now simply a demo/PoC:

- Host this with a permanent domain with AWS Amplify.
- Include AWS Shield for added DDoS protection.
- Improve UI elements to be more modern, but keep the minimalistic feel.
- Include an SSO feature where one can log in with their Google and Microsoft accounts, and log their workouts.
- Include feature where instead of looking at the "Name" field to fetch workouts, we look at the email used to log in.
- Include AI features to give suggestions on how to steadily improve based on past workout history and notes submitted with each workout.
- Add HTTPS/SSL into domain.

---

## 🔍 Post-Mortem Analysis:

  Although I had a lot of fun creating something that pertains to me, as I am passionate about working out, this wasn't without its challenges:

  - I've learned that ChatGPT CAN indeed make mistakes. As someone who isn't as inclined with programming, and is using the free-tier of ChatGPT, having to wait until my time limit was up,
  and backtracking/debugging was indeed frustrating and a struggle. However, the end result is always worth the trouble.
  - With the right usage of words, and big-picture knowledge of programming, even if you don't know how to write the code itself, you can prompt ChatGPT to write the code as you see fit,
  and you can orchestrate a vision (website or app) that you think may have been impossible previously.
  - AI tools like ChatGPT are a wonderful tool for putting your vision from mind to paper (or in this case, code).