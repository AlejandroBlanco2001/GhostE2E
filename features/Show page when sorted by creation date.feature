Feature: Show pages created in the list sorted by creation date

@user1 @web
Scenario: Login and create a page, and show the page in the list
  Given I login
  And I navigate to the "pages" functionality

  # Create a Page
  When I navigate to the "create page" functionality
  And I create the post with title "New page" and paragraph "Some text"
  And I save the "page"
  And I wait for 3 seconds
  And I navigate to the "pages" functionality

  # Create another Page
  When I navigate to the "create page" functionality
  And I create the post with title "New page 2" and paragraph "Some text 2"
  And I save the "page"
  And I wait for 3 seconds
  And I navigate to the "pages" functionality

  Then I should see the "New page 2, New page" in that order sorted in the current page
