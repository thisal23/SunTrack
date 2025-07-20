const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (angle) => (Math.PI / 180) * angle;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

exports.getDistancePerDay = async (req, res) => {
  try {
    const { year, month, plateNo } = req.query;

    // Validate input parameters
    if (!year || !month || !plateNo) {
      return res.status(400).json({ error: 'Year, month, and plate number are required' });
    }

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Fetch data from the database
    const rows = await sequelize.query(
      `
      SELECT x.plateNo, gs.recDate, gs.recTime, gs.latitude, gs.longitude
      FROM gpsdatas gs, gpsdevices x
      WHERE gs.deviceId = x.deviceId
        AND YEAR(gs.recDate) = :year
        AND MONTH(gs.recDate) = :month
        AND x.plateNo = :plateNo
      ORDER BY gs.recDate, gs.recTime
      `,
      {
        replacements: { year, month, plateNo },
        type: QueryTypes.SELECT,
      }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the given criteria' });
    }

    // Calculate total distance per day
    const grouped = {};
    rows.forEach((row) => {
      const key = row.recDate; // Group by recDate
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    });

    const distancePerDay = {};
    for (const date in grouped) {
      const points = grouped[date];
      let total = 0;

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        // Ensure valid coordinates before calculating distance
        if (
          p1.latitude != null &&
          p1.longitude != null &&
          p2.latitude != null &&
          p2.longitude != null
        ) {
          total += haversine(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
        }
      }

      distancePerDay[date] = total;
    }

    // Format the response
    const response = Object.keys(distancePerDay)
      .sort()
      .map((date) => ({
        date,
        distance: Number(distancePerDay[date].toFixed(2)), // Round to 2 decimal places
      }));

    res.json(response);
  } catch (error) {
    console.error('Error in getDistancePerDay:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};