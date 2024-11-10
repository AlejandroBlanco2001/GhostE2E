Feature: Show dashboard with 1 member

@user1 @web
Scenario: Login and create a member, and show the number of users in the dashboard
  Given I login
  And I navigate to the "member" functionality

  # Create a member
  When I navigate to the "create member" functionality
  And I fill the "member edit" "name" to "|FAKE_NAME|1"
  And I fill the "member edit" "email" to "|FAKE_EMAIL|1"
  And I fill the "member edit" "notes" to "|FAKE_PARAGRAPH|1"
  And I "save" the "member"
  And I wait for 3 seconds
  And I navigate to the "dashboard" functionality

  Then I should see the "1" in the current page