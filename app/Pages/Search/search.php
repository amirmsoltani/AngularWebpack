<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body ng-app="Search" >
    <div ng-controller="SearchController">
    <?php for($i=0;$i<10;$i++) { ?>
    {{text}}
    <?php } ?>
    </div>

    <test-s ></test-s>
    <test ></test>

</body>
</html>