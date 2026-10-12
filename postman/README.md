# Postman

API tests for the [AutomationExercise API](https://automationexercise.com/api_list), run with Postman CLI. The test cases they implement are documented in [`docs/API_TEST_CASES.md`](../docs/API_TEST_CASES.md).

- `automation-exercise.postman_environment.json` — environment with `baseUrl` (`https://automationexercise.com/api`).
- Collections exported from Postman go here too, named `*.postman_collection.json`.

Run a collection against the environment:

```bash
postman collection run postman/<collection>.postman_collection.json -e postman/automation-exercise.postman_environment.json
```
