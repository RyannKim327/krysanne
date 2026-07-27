function test(n: number) {
  // TODO: Setup for drop site
  const width = 5
  const height = 10
  let str = ""

  n = (n - 1) % width

  // TODO: For printing first line
  for (let j = 0; j < width; j++) {
    if (j === n) {
      str += "* "
    } else {
      str += ". "
    }
  }

  str += "\n"

  // TODO: For further line
  let i = 0;

  function _() {
    if (i < height) {
      const random = Math.floor(Math.random() * width)

      // TODO: Decision Process
      if (n >= width - 1) {
        n--
      } else if (n <= 0) {
        n++
      } else {
        if (random % 2 === 0) {
          n++
        } else {
          n--
        }
      }

      // TODO: Printing
      for (let j = 0; j < width; j++) {
        if (j === n) {
          str += "* "
        } else {
          str += ". "
        }
      }
      str += "\n"
      i++
      console.log(str)
      _()
    }
  }
  _()
}

test(5)

