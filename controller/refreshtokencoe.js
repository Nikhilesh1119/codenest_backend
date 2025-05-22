
router.get("/refresh", refreshTokenController);


const accessToken = generateAccessToken({ _id: user._id });
const refreshToken = generateRefreshToken({ _id: user._id });

export const refreshTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.send(error(401, "refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    return res.send(success(200, { accessToken }));
  } catch (e) {
    console.log(e.message);
    return res.send(error(401, "Invalid access token"));
  }
};

//internal method
export const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "365d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
