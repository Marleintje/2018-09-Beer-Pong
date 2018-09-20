import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from 'material-ui/Paper'
import Board from './Board'
import './GameDetails.css'

class GameDetails extends PureComponent {

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

  makeMove = (toRow, toCell) => {
    const {game, updateGame} = this.props
    const { players } = game
    const currentPlayer = players.filter(p => p.symbol === game.turn)
    const currentTurnPlayer = currentPlayer[0]

    const board = game.board.map(
      (row, rowIndex) => row.map((cell, cellIndex) => {
        // if (cell === 'c') return game.players.cupsclicked++
        if ((rowIndex === toRow && cellIndex === toCell) && (cell === 'c')) {
          console.log(currentTurnPlayer)
          console.log(`game.cup ${game.cup}`)
          return game.turn
        }
        if (rowIndex === toRow && cellIndex === toCell) {
          return game.turn
        }
        else return cell
      })
    )
    updateGame(game.id, board)
    // this.drinkBeer(game.board)
  }

  // drinkBeer = (board) => {
  //   const winnerScoreX = board
  //     .map(array => array.includes('X'))
  //     .filter(trueOrFalse => trueOrFalse)
  //     .length
  //   const winnerScoreO = board
  //     .map(array => array.includes('O'))
  //     .filter(trueOrFalse => trueOrFalse)
  //     .length
  //   if (winnerScoreX === 1) {
  //     return <div>
  //       Drink your beer!
  //       <img alt='beer' src={'https://cdn1.wine-searcher.net/images/labels/90/80/heineken-lager-beer-amsterdam-netherlands-10519080.jpg'}/>
  //     </div>
  //   } if (winnerScoreX === 2) {
  //     return <div>
  //       Drink again! Watch out, if that loser across from you gets one more in a cup, you lose!
  //       <img alt='beer' src={'https://cdn1.wine-searcher.net/images/labels/90/80/heineken-lager-beer-amsterdam-netherlands-10519080.jpg'}/>
  //     </div>
  //   } if (winnerScoreO === 1) {
  //     return <div>
  //       Drink your beer!
  //       <img alt='beer' src={'https://cdn1.wine-searcher.net/images/labels/90/80/heineken-lager-beer-amsterdam-netherlands-10519080.jpg'}/>
  //     </div>
  //   } if (winnerScoreX === 2) {
  //     return <div>
  //       Drink again! Watch out, if that loser across from you gets one more in a cup, you lose!
  //       <img alt='beer' src={'https://cdn1.wine-searcher.net/images/labels/90/80/heineken-lager-beer-amsterdam-netherlands-10519080.jpg'}/>
  //     </div>
  //   } else return null
  // }



  render() {
    const {game, users, authenticated, userId} = this.props

    if (!authenticated) return (
			<Redirect to="/login" />
		)

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)
    const playerX = game.players.symbol === 'x'
    const playerO = game.players.symbl === 'o'

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0]

    // const loser = game.players.symbol != game.turn

    return (<Paper className="outer-paper">
      {
        game.status === 'started' &&
        <div className='instructions'>
          <h2>Welcome to Beer Pong!</h2>
          <p>Some cups are hidden under the MURICAN' FLAGS.
            You want to hit as many cups as possible.
            <br/>
            How do you play?
            <br/>
            <br/>
            1) Get a beer (Meaning, get a real beer!)
            <br/>
            2) Throw a ball! (So, click a field when it’s your turn!)
            <br/>
            <br/>
            If you HIT a cup, a cup will appear.
            <br/>
            If you MISSED, a ball will appear.
            <br/>
            First player that hits 3 cups wins!!
            <br/>
            The loser downs his beer!!
          </p>
          {/* {this.drinkBeer()} */}
        </div>
      }
      <br/>
      {
        game.status === 'started' &&
        player && player.symbol === game.turn &&
        <div>Go alreadyyyyyyyyy!</div>
      }
      
      {
        game.board.includes
      }
      {
        game.status === 'started' &&
        player.symbol !== game.turn &&
        <div>Wait your turn bro...</div>
      }

      {
        game.status === 'pending' &&
        game.players.map(p => p.userId).indexOf(userId) === -1 &&
        <button onClick={this.joinGame}>Join Game</button>
      }

      {
        winner &&
        <div>
          <p>yooOOooOo {users[winner].firstName}, you won bro</p>
          {/* <p>{users[loser].firstName}, drink up!</p> */}
        </div>
      }

      <hr />

      {
        game.status !== 'pending' &&
        <Board board={game.board} makeMove={this.makeMove} className='whole-board' />
      }
    </Paper>)
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users
})

const mapDispatchToProps = {
  getGames, getUsers, joinGame, updateGame
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)
