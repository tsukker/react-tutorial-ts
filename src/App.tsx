import React from 'react';
import './App.css';

type SquareContent = "X" | "O" | null;

type SquareProps = {
  value: SquareContent;
  onClick: () => void;
  highlight: boolean;
  key: string;
};

type BoardProps = {
  squares: Array<SquareContent>;
  onClick: (i: number) => void;
  winningSquares: Array<number>;
};

type GameMove = {
  squares: Array<SquareContent>;
  col: number;
  row: number;
};

type GameState = {
  history: Array<GameMove>;
  historyOrderIsAscending: boolean;
  stepNumber: number;
  xIsNext: boolean;
};

function Square(props: SquareProps) {
  const className = "square" + (props.highlight ? " square-highlight" : "");
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component<BoardProps, GameState> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} // `this` indicates `renderSquare` because it is in arrow function.
        highlight={this.props.winningSquares.includes(i)}
        key={"board-row-square-" + i}
      />
    );
  }

  render() {
    const n = 3;
    const board = Array(n);
    for (let r = 0; r < n; r++) {
      const row = Array(n);
      for (let c = 0; c < n; c++) {
        row[c] = this.renderSquare(r * n + c);
      }
      board[r] = (
        <div className="board-row" key={"board-row-" + r}>
          {row}
        </div>
      );
    }

    return <div>{board}</div>;
  }
}

class Game extends React.Component<any, GameState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          col: -1,
          row: -1,
        },
      ],
      historyOrderIsAscending: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calclateResult(squares).winner) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        { squares: squares, col: i % 3, row: Math.floor(i / 3) },
      ]),
      stepNumber: this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext,
    });
  }

  reverseHistoryOrder() {
    this.setState({
      historyOrderIsAscending: !this.state.historyOrderIsAscending,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calclateResult(current.squares);

    const moves = history.map((his, index) => {
      const desc =
        index === 0
          ? "Go to game start"
          : `Go to move #${index}: (${his.col}, ${his.row})`;
      return (
        <li key={index}>
          <button
            className={index === this.state.stepNumber ? "bold" : undefined}
            onClick={() => this.jumpTo(index)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (result.winner) {
      status = "Winner: " + result.winner;
    } else if (this.state.stepNumber === 9) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={result.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseHistoryOrder()}>
            {"Reverse history order"}
          </button>
          <ol>
            {this.state.historyOrderIsAscending
              ? moves
              : moves.slice().reverse()}
          </ol>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;

// ========================================

function calclateResult(squares: Array<SquareContent>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const isWinning = Array(9).fill(false);
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      isWinning[a] = isWinning[b] = isWinning[c] = true;
    }
  }
  const winningSquares = isWinning.flatMap((winning, index) =>
    winning ? [index] : []
  );
  const winner = winningSquares === [] ? null : squares[winningSquares[0]];
  return { winner: winner, winningSquares: winningSquares };
}
