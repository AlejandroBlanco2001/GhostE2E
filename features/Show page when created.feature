Feature: Show page created in the list

@user1 @web
Scenario: Login and create a page, and show the page in the list
  Given I login
  And I navigate to the "pages" functionality

  # Create a Post
  When I navigate to the "create page" functionality
  And I create the post with title "New page" and paragraph "Some text"
  And I save the "page"
  And I wait for 3 seconds
  And I navigate to the "pages" functionality

  Then I should see the "New page" in the current page
