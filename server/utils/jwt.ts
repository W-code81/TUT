
import jwt from 'jsonwebtoken'
export function signToken(userId: number) {
    return jwt.sign(
        { id: userId },
        process.env.JWT_PRIVATE!,
        {
            expiresIn: "1d",
            algorithm: 'HS256'
        }
    )
}

export function verifyToken(token: string) {
    return jwt.verify(
        token,
        process.env.JWT_PRIVATE!
    ) as { id: number }
}