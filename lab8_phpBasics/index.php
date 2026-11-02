<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lab 8</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>

    <h1>Lab 8: PHP Basics</h1>
    <br>
    <h3>Task 1: Temperature Array</h3>
    <div class="task">
        <?php
        function getAvg(array &$arr): float{
            $sum = 0;
            for ($i=0; $i<sizeof($arr); $i++){
                $sum += $arr[$i];
            }
            $avgTemp = $sum/sizeof($arr);
            return $avgTemp;
        }
        function printFirstSeven(array &$arr): void{
            for($i=0; $i<7; $i++){
                echo $arr[$i]." ";
            }
            }
            $temperatureArr = [73, 65, 64, 57, 71, 70, 59, 75, 65, 64, 61, 
                               68, 70, 68, 64, 65, 58, 66, 57, 55];
            
            printf("<br>Average temperature is: ". getAvg($temperatureArr));
            
            printf("<br>List of seven lowest temperatures: ");
            sort($temperatureArr); // sort ascending order
            printFirstSeven($temperatureArr);
            
            echo "<br>List of seven highest temperatures: ";
            rsort($temperatureArr); //reverse sort in decending order
            printFirstSeven($temperatureArr);
        ?>
    </div>

    <h3>Task 2: Multiplication Table</h3>
    <div class="task">
        <?php
            echo "<table>";
            for($i=1; $i<7; $i++){
                echo "</tr>";
                for($j=1; $j<6; $j++){
                    $prod = $i*$j; 
                    echo "<td> $i * $j = $prod </td>";
                    }
                    echo "</tr>";
                    }
            echo "</table>";
        ?>
    </div>
    
    <h3>Task 3: 8 x 8 Chessboard</h3>
    <div class="task">
        <?php
            $colourToggle = 1; //1 for black, 0 for white
            echo "<div class='chess-wrapper'>";
            for($i=1; $i < 9; $i++){
                echo "<div class='chess-row-wrapper'>";
                for($j=1; $j < 9; $j++){
                    $chessColourClass = ($colourToggle ? "block-black" : "block-white");
                    $colourToggle = $colourToggle ^ 1;
                    echo "<div class='chess-block {$chessColourClass}'> </div>";
                }
                echo "</div>";
                $colourToggle = $colourToggle ^ 1; //alternate starting colour for each row
            }
            echo "</div>";
        ?>
    </div>

    
</body>
</html>