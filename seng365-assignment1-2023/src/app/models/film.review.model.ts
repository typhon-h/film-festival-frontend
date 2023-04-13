import {getPool} from "../../config/db";

const getReviews = async (id:number): Promise<review[]> => {
    const query = `SELECT
    R.user_id as reviewerId,
    U.first_name as reviewerFirstName,
    U.last_name as reviewerLastName,
    R.rating as rating,
    R.review as review,
    R.timestamp as timestamp
    FROM film_review R LEFT JOIN user U on R.user_id = U.id
    WHERE film_id=?
    ORDER BY timestamp DESC`
    const rows = await getPool().query(query, [id])
    return rows[0] as review[]
}

const addReview = async (filmId: number, userId: number, review: string, rating: number): Promise<boolean> => {
    const query = "INSERT INTO film_review (film_id, user_id, rating, review, timestamp) VALUES (?, ?, ?, ?, ?)";
    const [result] = await getPool().query(query, [filmId, userId, rating, review, new Date()]);
    return result && result.affectedRows === 1;

}

export {getReviews, addReview}