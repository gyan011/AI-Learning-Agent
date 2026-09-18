import os

from locust import HttpUser, task, between


class TutorAIUser(HttpUser):
    wait_time = between(5, 10)

    def on_start(self):
        """Login once when each Locust user starts."""

        email = os.getenv("LOCUST_EMAIL")
        password = os.getenv("LOCUST_PASSWORD")

        if not email or not password:
            raise RuntimeError(
                "Set LOCUST_EMAIL and LOCUST_PASSWORD environment variables."
            )

        response = self.client.post(
            "/auth/login",
            json={
                "email": email,
                "password": password,
            },
            name="POST /auth/login",
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"Login failed: {response.status_code} - {response.text}"
            )

        token = response.json()["access_token"]

        self.auth_headers = {
            "Authorization": f"Bearer {token}"
        }

    @task
    def ask_tutor(self):
        with self.client.post(
            "/tutor/ask",
            json={
                "question": "Explain the main concepts from the uploaded study material.",
                "history": []
            },
            headers=self.auth_headers,
            name="POST /tutor/ask",
            catch_response=True,
        ) as response:

            print(
                f"\nTutor status: {response.status_code}"
                f"\nTutor response: {response.text}\n"
            )

            if response.status_code != 200:
                response.failure(
                    f"Status {response.status_code}: {response.text}"
                )
                