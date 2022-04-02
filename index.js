function binarySearch(xs, key) {
    let start = 0;
    let end = xs.length - 1;

    while (start <= end) {
        let middle = Math.floor((start + end) / 2);
        if (key === xs[middle]) {
            return middle;
        } else if (key > xs[middle]) {
            start = middle + 1;
        } else {
            end = middle - 1;
        }
    }

    return -1;
}

(() => {
    let xs = [10, 55, 5, 1, 89];
    for (let i = 0; i < xs.length; i++) {
        for (let j = 0; j < xs.length - i - 1; j++) {
            if (xs[j] > xs[j + 1]) {
                let temp = xs[j];
                xs[j] = xs[j + 1];
                xs[j + 1] = temp;
            }
        }
    }
    console.log(xs)
    console.log(binarySearch(xs, 555))
})()
