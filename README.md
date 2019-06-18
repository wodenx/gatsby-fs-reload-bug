This illustrates an issue with data flow on page reload.

Steps to reproduce:

1. Clone this repo
2. Run npm i
3. Run gatsby develop
4. open both the homepage and /page-2 in separate browser tabs.
4. Manually edit data in /src/data/pages/page.json
5. Verify that the changes are reflected in the browser.
6. Reload both pages

Expected Result

The updated data is displayed on both pages after reload.

Actual Result

The updated data is displayed on the homepage after reload.
On /page-2 the original data (prior to modification from step 4)
is displayed.

Restartign the app causes the updated data to be displayed on
both pages.

