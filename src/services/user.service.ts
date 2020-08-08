import { User } from '../models/user'
import pool from '../config/db'
import { Movie } from '../models/movie'

class UserService {
    async getUser(userId: number): Promise<User> {
        const sql = `SELECT *
                     FROM "user"
                     WHERE id = $1`
        const {rows} = await pool.query(sql, [userId])
        return rows[0]
    }

    async saveUser(email, password, displayName, avatarUrl): Promise<User> {
        const sql = `INSERT INTO "user" (email, password, "displayName", "avatarUrl")
                     VALUES ($1, $2, $3, $4)`
        const {rows} = await pool.query(sql, [email, password, displayName, avatarUrl])
        return rows[0]
    }

    async getContinueWatchingMovies(userId: number): Promise<Movie[]> {
        /*      const sql = `SELECT * FROM user_continue_watching WHERE "userId" = $1`
              const {rows} = await pool.query(sql, [userId])
              return rows*/

        const sql = `SELECT *
                     FROM movie
                     ORDER BY id
                     LIMIT 60`
        const {rows} = await pool.query(sql)
        return rows
    }

    async getFavoriteMovies(userId: number): Promise<Movie[]> {
        const sql = `SELECT m.*
                     FROM movie m
                              INNER JOIN user_favorite uf on m.id = uf."movieId"
                     WHERE "userId" = $1`
        const {rows} = await pool.query(sql, [userId])
        return rows
    }

    async saveFavorite(movieId: number): Promise<Movie> {
        const sql = `INSERT INTO user_favorite ("movieId", "userId")
                     VALUES ($1, $2)
                     RETURNING *`
        const {rows} = await pool.query(sql, [movieId, 1])
        return rows[0]
    }
}

export const userService = new UserService()