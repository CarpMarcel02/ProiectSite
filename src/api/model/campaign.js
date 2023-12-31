const pool = require("../database/connection");
const { getFile } = require("./s3Services");
exports.addCampaign = async (campaignData) => {
  const result = await pool
    .query("INSERT INTO campaigns (title, article,image) VALUES ($1, $2,$3)", [
      campaignData.title,
      campaignData.article,
      campaignData.img,
    ])
    .then((results) => {
      return { message: "Campanie adaugata cu succes" };
    })
    .catch((error) => {
      if (error.code === "23505") {
        return { message: "Exista deja o campanie cu acest nume" };
      } else {
        return { message: "Server Error" };
      }
    });
  return result;
};
exports.getArticleImageByTitle = async (title) => {
  const result = await pool.query(
    "SELECT image FROM campaigns WHERE title = $1",
    [title]
  );
};
exports.getArticleImageByTitle = async (title) => {
  try {
    const result = await pool.query(
      "SELECT image FROM campaigns WHERE title = $1",
      [title]
    );

    if (result.rows.length > 0) {
      return result.rows[0].image;
    } else {
      return {
        message: "Nu exista o campanie cu un astfel de nume",
      };
    }
  } catch (error) {
    return {
      message: "Server Error",
    };
  }
};

exports.getAllCampaigns = async () => {
  try {
    const result = await pool.query("SELECT * FROM campaigns");
    const campaigns = await Promise.all(
      result.rows.map(async (campaign) => {
        const url = await getFile(campaign.image);
        return {
          ...campaign,
          image: url,
        };
      })
    );

    return {
      campaigns,
      message: "Campaigns fetched successfully",
    };
  } catch (error) {
    console.log(error);
    return { message: "Server Error" };
  }
};

exports.deleteCampaignByTitle = async (title) => {
  return await pool
    .query("DELETE FROM campaigns WHERE title = $1", [title])
    .then((results) => {
      if (results.rowCount > 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};
