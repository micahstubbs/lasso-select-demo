// https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.2020.html#list-tab-7YO1J07XQHL9SZR4H9

import exec from "child_process";

const fileUrl =
  "https://www2.census.gov/geo/tiger/GENZ2020/shp/cb_2020_us_zcta520_500k.zip";

exec.exec("curl -o ./data/geography/cb_2020_us_zcta520_500k.zip ${fileUrl}");
