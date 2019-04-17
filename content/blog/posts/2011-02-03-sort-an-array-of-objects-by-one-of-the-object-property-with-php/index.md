---
id: 952
title: Sort an array of objects by one of the objects property with PHP
date: 2011-02-03T15:20:08+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=952
permalink: /blog/2011/02/sort-an-array-of-objects-by-one-of-the-object-property-with-php/
dsq_thread_id:
  - "653773207"
categories:
  - Sofware Development
tags:
  - objects
  - php. sort
---
<img class="alignright" style="float: right; margin: 0 0 10px 10px;" src="/assets/2011/02/Sorting_quicksort_anim.gif" alt="Quicksort algorithm animation" />

If you want to sort an array of objects but using one of its object properties you can do it with [usort](http://php.net/manual/en/function.usort.php), but this could take a lot of time and will be very computational expensive. So I have implemented one method you can insert into one of your PHP classes. This method implements the [quicksort algorithm](http://en.wikipedia.org/wiki/Quicksort). As a result I have experienced a huge performance improvement against usort: one array of objects with 10.000 elements sorted with usort takes ~3.4 sg, and with quicksort algorithm takes, in my samples, ~0.56 sg. Awesome isn't it? Just take the code:

    /**
     * Sort one array of objects by one of the object's property
     *
     * @param mixed $array, the array of objects
     * @param mixed $property, the property to sort with
     * @return mixed, the sorted $array
     **/
    static public function sortArrayofObjectByProperty( $array, $property )
    {
        $cur = 1;
        $stack[1]['l'] = 0;
        $stack[1]['r'] = count($array)-1;

        do
        {
            $l = $stack[$cur]['l'];
            $r = $stack[$cur]['r'];
            $cur--;

            do
            {
                $i = $l;
                $j = $r;
                $tmp = $array[(int)( ($l+$r)/2 )];

                // split the array in to parts
                // first: objects with "smaller" property $property
                // second: objects with "bigger" property $property
                do
                {
                    while( $array[$i]->{$property} < $tmp->{$property} ) $i++;
                    while( $tmp->{$property} < $array[$j]->{$property} ) $j--;

                    // Swap elements of two parts if necesary
                    if( $i <= $j)
                    {
                        $w = $array[$i];
                        $array[$i] = $array[$j];
                        $array[$j] = $w;

                        $i++;
                        $j--;
                    }

                } while ( $i <= $j );

                if( $i < $r ) {
                    $cur++;
                    $stack[$cur]['l'] = $i;
                    $stack[$cur]['r'] = $r;
                }
                $r = $j;

            } while ( $l < $r );

        } while ( $cur != 0 );

        return $array;

    }
