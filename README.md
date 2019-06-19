This illustrates an issue with data flow on page reload.

Steps to reproduce:

1. Clone this repo
2. Run npm i
3. Run gatsby develop
4. open both the homepage and /page-2 in separate browser tabs.
4. Manually edit data in /src/data/pages/page.txt
5. Verify that the changes are reflected in the browser (size and changeTime should update).
6. Reload both pages

Expected Result

The changes are reflected on both pages after reload.

Actual Result

The changes are reflected on the homepage after reload.
On /page-2 the original data (prior to modification from step 4)
is displayed.

Restartign the app causes the updated data to be displayed on
both pages.

