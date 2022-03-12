export class Node {
    private isStart: boolean = false;
    private isEnd: boolean = false;
    private isPath: boolean = false;
    private isFound: number = 0;
    private isWall: boolean = false;

    isEmpty(): boolean {
        return !(this.isStart || this.isEnd || this.isPath || this.isFound || this.isWall)
    }

}