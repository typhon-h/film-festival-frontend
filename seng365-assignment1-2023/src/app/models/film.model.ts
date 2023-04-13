import {getPool} from "../../config/db";
import {ResultSetHeader} from "mysql2";

const viewAll = async (searchQuery: filmSearchQuery): Promise<filmReturn> => {
    let query = `SELECT
    F.id as filmId,
    F.title as title,
    F.genre_id as genreId,
    F.director_id as directorId,
    U.first_name as directorFirstName,
    U.last_name as directorLastName,
    F.release_date as releaseDate,
    F.age_rating as ageRating,
    (SELECT FORMAT(IFNULL(AVG(rating), 0), 2) FROM film_review WHERE film_id = F.id) as rating
    FROM film F JOIN user U on F.director_id = U.id `;
    let countQuery = `SELECT COUNT(F.id) from film F JOIN user U on F.director_id = U.id `

    if (searchQuery.reviewerId && searchQuery.reviewerId !== -1) {
        query += `INNER JOIN (SELECT DISTINCT user_id, film_id from film_review) R on F.id = R.film_id AND R.user_id = ${searchQuery.reviewerId} `
        countQuery += `INNER JOIN (SELECT DISTINCT user_id, film_id from film_review) R on F.id = R.film_id AND R.user_id = ${searchQuery.reviewerId} `
    }

    const whereConditions: string[] = []
    const values: any[] = []
    if (searchQuery.q && searchQuery.q !== "") {
        whereConditions.push('(title LIKE ? OR description LIKE ?)');
        values.push(`%${searchQuery.q}%`);
        values.push(`%${searchQuery.q}%`);
    }

    if (searchQuery.directorId && searchQuery.directorId !== -1) {
        whereConditions.push('director_id = ?');
        values.push(searchQuery.directorId);
    }

    if (searchQuery.genreIds && searchQuery.genreIds.length) {
        whereConditions.push('genre_id in (?)');
        values.push(searchQuery.genreIds);
    }

    if (searchQuery.ageRatings && searchQuery.ageRatings.length) {
        whereConditions.push('age_rating in (?)');
        values.push(searchQuery.ageRatings);
    }

    if (whereConditions.length) {
        query += `\nWHERE ${(whereConditions ? whereConditions.join(' AND ') : 1)}\n`
        countQuery += `\nWHERE ${(whereConditions ? whereConditions.join(' AND ') : 1)}\n`
    }
    const countValues = [...values];

    const searchSwitch = (sort: string) => ({
        'ALPHABETICAL_ASC': `ORDER BY title ASC`,
        'ALPHABETICAL_DESC': `ORDER BY title DESC`,
        'RATING_ASC': `ORDER BY CAST(rating AS FLOAT) ASC`,
        'RATING_DESC': `ORDER BY CAST(rating AS FLOAT) DESC`,
        'RELEASED_ASC': `ORDER BY releaseDate ASC`,
        'RELEASED_DESC': `ORDER BY releaseDate DESC`
    })[sort];
    query += searchSwitch(searchQuery.sortBy) + ', filmId\n';

    if (searchQuery.count && searchQuery.count !== -1) {
        query += 'LIMIT ?\n';
        values.push(searchQuery.count);
    }

    if (searchQuery.startIndex && searchQuery.startIndex !== -1) {
        if (!searchQuery.count || searchQuery.count === -1) {
            query += 'LIMIT ?\n';
            values.push(10000000);
        }
        query += 'OFFSET ?\n';
        values.push(searchQuery.startIndex);
    }


    const rows = await getPool().query(query, values);
    const films = rows[0];
    films.forEach((film: film) => film.rating = +film.rating);
    const countRows = await getPool().query(countQuery, countValues);
    const count = Object.values(JSON.parse(JSON.stringify(countRows[0][0])))[0];
    return {films, count} as filmReturn;
};

const getOne = async (id: number): Promise<filmFull> => {
    const query = `SELECT
    F.id as filmId,
    F.title as title,
    F.description as description,
    F.genre_id as genreId,
    F.director_id as directorId,
    U.first_name as directorFirstName,
    U.last_name as directorLastName,
    F.release_date as releaseDate,
    F.age_rating as ageRating,
    F.runtime as runtime,
    (SELECT FORMAT(AVG(rating), 2) FROM film_review WHERE film_id = F.id) as rating,
    (SELECT COUNT(id) FROM film_review WHERE film_id = F.id) as numReviews
    FROM film F JOIN user U on F.director_id = U.id
    WHERE F.id=?`;
    const rows = await getPool().query(query, id);
    const film = rows[0].length === 0 ? null : rows[0][0] as unknown as filmFull;
    if (film!== null) {
        film.rating = +film.rating;
    }
    return film;
}

const addOne = async (directorId: number, title: string, description: string, releaseDate: string, ageRating: string, genreId: number, runtime: number): Promise<ResultSetHeader> => {
    const query = `INSERT INTO film (director_id, title, description, release_date, age_rating, genre_id, runtime) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await getPool().query(query, [directorId, title, description, releaseDate, ageRating, genreId, runtime]);
    return result;
}

const editOne = async (id: number, title: string, description: string, releaseDate: string, ageRating: string, genreId: number, runtime: number): Promise<boolean> => {
    const query = `UPDATE film SET title=?, description=?, release_date=?, age_rating=?, genre_id=?, runtime=? WHERE id=?`;
    const [result] = await getPool().query(query, [title, description, releaseDate, ageRating, genreId, runtime, id]);
    return result && result.affectedRows === 1;
}

const deleteOne = async (id: number): Promise<boolean> => {
    const query = `DELETE FROM film WHERE id = ?`;
    const [result] = await getPool().query(query, id);
    return result && result.affectedRows === 1;
}

const getGenres = async (): Promise<genre[]> => {
    const query = `SELECT id as genreId, name FROM genre`
    const rows = await getPool().query(query)
    return rows[0] as genre[];
}

const getImageFilename = async (id: number): Promise<string> => {
    const query = 'SELECT `image_filename` FROM `film` WHERE id = ?';
    const rows = await getPool().query(query, [id]);
    return rows[0].length === 0 ? null : rows[0][0].image_filename;
}

const setImageFilename = async (id: number, filename: string): Promise<void> => {
    const query = "UPDATE `film` SET `image_filename`=? WHERE `id`=?";
    const result = await getPool().query(query, [filename, id]);
}

export {viewAll, getOne, addOne, editOne, deleteOne, getGenres, getImageFilename, setImageFilename};