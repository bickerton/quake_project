# tasks (index first, then history second)
1. basic html
2. top sections
3. card list( just one)
4. style page

## Introduction (what project is about)
I originally set out to produce a site showing recent earthquake activity on a ARCGIS MAP but based on the instructors recommendations, it was decided to make a website allowing the user to enter a location to see earthquake activity occurring within the region specified. By linking a location to the US geological survey. one API was created to allow this information to be displayed  both on a national or as a local region of activity. The API was then utilized to show graphically the number of earthquakes occurring over a weeks worth of activity in a given region.  
A third party app (chartsjs) was used to produce the graphs that displayed the weeks historical data.

## tasks
Design: created a markup using ms paint.
Build the HTML/CSS: To create a UI design.
Wrote the script: To make the UI/UX functional by fetching the data and producing it in the HTML

## conclusion (how well did we accomplish the task and any pivot or change of features)
Specific areas that were time consuming:
1) Aquiring a code outline so that the information could efficiently run;
2) converting UNIX time to a user friendly format;
3) Transforming the data so that the user could enter a location easily without errors occurring;
4) How to integrate the graphs so that they would render correctly (no activity vs many acitivities) when button was initiated (there are still a few issues with this that would need further exploaration for a 100% working site)
