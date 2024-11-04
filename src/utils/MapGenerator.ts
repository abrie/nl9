class MapGenerator {
  private width: number;
  private height: number;
  private initialFillProbability: number;
  private numberOfIterations: number;
  private birthLimit: number;
  private deathLimit: number;

  constructor(
    width: number,
    height: number,
    initialFillProbability: number,
    numberOfIterations: number,
    birthLimit: number,
    deathLimit: number
  ) {
    this.width = width;
    this.height = height;
    this.initialFillProbability = initialFillProbability;
    this.numberOfIterations = numberOfIterations;
    this.birthLimit = birthLimit;
    this.deathLimit = deathLimit;
  }

  generateMap(): number[][] {
    let map = this.initializeMap();

    for (let i = 0; i < this.numberOfIterations; i++) {
      map = this.simulateStep(map);
    }

    return map;
  }

  private initializeMap(): number[][] {
    const map = Array.from({ length: this.height }, () =>
      Array(this.width).fill(0)
    );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (Math.random() < this.initialFillProbability) {
          map[y][x] = 1;
        }
      }
    }

    this.fillEdgesWithWalls(map);

    return map;
  }

  private fillEdgesWithWalls(map: number[][]): void {
    for (let y = 0; y < this.height; y++) {
      map[y][0] = 1;
      map[y][this.width - 1] = 1;
    }

    for (let x = 0; x < this.width; x++) {
      map[0][x] = 1;
      map[this.height - 1][x] = 1;
    }
  }

  private simulateStep(map: number[][]): number[][] {
    const newMap = map.map((arr) => arr.slice());

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const aliveNeighbors = this.countAliveNeighbors(map, x, y);

        if (map[y][x] === 1) {
          if (aliveNeighbors < this.deathLimit) {
            newMap[y][x] = 0;
          } else {
            newMap[y][x] = 1;
          }
        } else {
          if (aliveNeighbors > this.birthLimit) {
            newMap[y][x] = 1;
          } else {
            newMap[y][x] = 0;
          }
        }
      }
    }

    return newMap;
  }

  private countAliveNeighbors(map: number[][], x: number, y: number): number {
    let count = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const neighborX = x + i;
        const neighborY = y + j;

        if (i === 0 && j === 0) {
          continue;
        } else if (
          neighborX < 0 ||
          neighborY < 0 ||
          neighborX >= map[0].length ||
          neighborY >= map.length
        ) {
          count++;
        } else if (map[neighborY][neighborX] === 1) {
          count++;
        }
      }
    }
    return count;
  }
}

export default MapGenerator;
