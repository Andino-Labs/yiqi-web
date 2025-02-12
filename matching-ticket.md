# Matchmaking

## Background

Currently, in both the `dev` branch and `main` branch, we have an integrated data ingestion functionality. This functionality collects various user information and stores it within the user model. See: `dataCollected Json?` in `schema.prisma` and `src/schemas/userSchema.ts` (`userDataCollectedSchema`). This data is processed and converted into embeddings using an AWS model. More details can be found in `src/lib/data/processors/processUserFirstPartyData.ts`.

This processing is done asynchronously using a cron job of type `PROCESS_USER_DATA`. More details can be found in `src/lib/cron/queueCron.ts`.

The first step of this feature is to create a cron job that checks whether the user has answered at least one of the form questions and has uploaded their CV. Using this data, the user's profile is created. Additionally, you need to consider edge cases (e.g., scheduling another processing if the data is updated, etc.). You can find this form at `/user/networking-settings`. Instead of scheduling the processing each time the form is submitted, it should be handled through the cron job.

Additionally, you will need to fix the endpoint responsible for uploading the CV to S3, ensuring that the correct S3 URL is stored in the database.

You will also need to implement or consult the logic to generate an object containing the user's matches. The suggested structure be as follows:

```json
[
  {
    "userName": "",
    "profilePicUrl": "",
    "whyshouldwemet": "",
    "about": ""
  }
]
```

---

## User Story 1

**As a developer, I want to implement a dynamic banner that displays an informational message encouraging users to check in to participate in AI matchmaking, to boost participation and ensure that users are aware of the access conditions.**

### Acceptance Criteria:

- The banner must display the ongoing event with its information (image and title).
- If the user has not checked in, the message **"Check in to participate in AI matchmaking"** should appear.
- If the user has checked in, a **"View Recommended Connections"** button should appear, redirecting to the networking section with the recommended results.
- The banner must be responsive and functional on both mobile and desktop devices.

---

## User Story 2

**As a user, I want to see a message encouraging me to complete my profile to participate in AI matchmaking if I haven’t done so yet, to have the opportunity to be recommended in the connection system.**

### Acceptance Criteria:

- If the user has not completed their networking profile, the banner must display a message saying **"Complete your profile to participate in AI matchmaking."**
- This message must include a button that redirects to the profile editing section.

---

## User Story 3

**As a user who has checked in but has not completed my networking profile in Yiqi, I want to see a message on the banner encouraging me to complete my profile so I can access AI matchmaking and take advantage of the connection recommendations.**

### Acceptance Criteria:

- The banner must display a message like **"Complete your Networking profile to participate in AI matchmaking"** if the user has checked in but has not completed their profile.
- The message must include a button that redirects the user to the profile editing section to complete the necessary information.
- The system must ensure that the user can only access AI matchmaking after completing their profile.

---

## User Story 4

**As a user who has not checked in or completed my networking profile in Yiqi, I want to see a message on the banner recommending me to go to the event registration to check in and complete my profile, so I can participate in AI matchmaking.**

### Acceptance Criteria:

- The banner must display a clear message like **"Go to the event registration to check in and complete your networking profile to access AI matchmaking."**
- The message must be visible only to users who have not checked in or completed their networking profile.
- The banner must include clear instructions on how to proceed with both actions (check in and complete the profile).

---

## User Story 5

**As an event organizer, I want to ensure that users who have neither checked in nor completed their networking profile in Yiqi receive a clear message in the banner, guiding them to complete both actions so they can access AI matchmaking.**

### Acceptance Criteria:

- The banner must display an informative message indicating that the user needs to check in and complete their networking profile in Yiqi.
- The message must be visible only to users who have not completed both actions.
- The system must ensure that users who check in and complete their networking profile can access the AI matchmaking functionality.
