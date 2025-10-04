import React, { useState, useEffect } from "react";

// MOVE ALL HELPER FUNCTIONS TO THE TOP
const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: "Good", color: "#66BB6A", emoji: "😊" };
  if (aqi <= 100) return { level: "Moderate", color: "#FFA726", emoji: "😐" };
  if (aqi <= 150) return { level: "Unhealthy", color: "#EF5350", emoji: "😷" };
  return { level: "Hazardous", color: "#7B1FA2", emoji: "☠️" };
};

const getFutureDates = () => {
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case "up":
      return "↗️";
    case "down":
      return "↘️";
    default:
      return "➡️";
  }
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
};

// NOW DEFINE THE COMPONENT
const CityDetailsPage = ({ city, onBack, todayData, forecast }) => {
  const [userProfile, setUserProfile] = useState("general");
  const [currentDate] = useState(new Date());

  if (!city) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>City not found</h1>
        <button onClick={onBack}>Back to Map</button>
      </div>
    );
  }

  // forecasting
  const futureDates = getFutureDates();

  // mock pollutant data
const pollutantData = {
  "PM2.5": { 
    value: todayData?.pm25 ? todayData.pm25.toFixed(1) : "12.3", 
    level: todayData?.pm25 <= 12 ? "Good" : todayData?.pm25 <= 35.4 ? "Moderate" : "Unhealthy", 
    color: todayData?.pm25 <= 12 ? "#66BB6A" : todayData?.pm25 <= 35.4 ? "#FFA726" : "#EF5350" 
  },
  "PM10": { 
    value: "23.1", 
    level: "Good", 
    color: "#66BB6A" 
  },
  "NO2": { 
    value: todayData?.no2 ? (todayData.no2 / 1e14).toFixed(1) : "18.7", 
    level: todayData?.no2 ? (todayData.no2 <= 2e15 ? "Good" : "Moderate") : "Moderate", 
    color: todayData?.no2 ? (todayData.no2 <= 2e15 ? "#66BB6A" : "#FFA726") : "#FFA726" 
  },
  "O3": { 
    value: "45.2", 
    level: "Unhealthy", 
    color: "#EF5350" 
  },
  "SO2": { 
    value: "2.1", 
    level: "Good", 
    color: "#66BB6A" 
  },
  "CO": { 
    value: "0.8", 
    level: "Good", 
    color: "#66BB6A" 
  },
};

  // forecast data - use real data if available
  const currentAQIValue = todayData?.aqi || city.avg_aqi;
  const forecastData = forecast ? [
    { date: futureDates[0], aqi: currentAQIValue, trend: "stable" },
    { date: futureDates[1], aqi: forecast.tomorrow_aqi, trend: "up" }, // Use real forecast
    { date: futureDates[2], aqi: Math.max(0, forecast.tomorrow_aqi - 5), trend: "down" },
    { date: futureDates[3], aqi: Math.min(300, forecast.tomorrow_aqi + 3), trend: "up" },
    { date: futureDates[4], aqi: Math.max(0, forecast.tomorrow_aqi - 8), trend: "down" },
  ] : [
    { date: futureDates[0], aqi: currentAQIValue, trend: "stable" },
    { date: futureDates[1], aqi: Math.min(300, currentAQIValue + 7), trend: "up" },
    { date: futureDates[2], aqi: Math.max(0, currentAQIValue - 3), trend: "down" },
    { date: futureDates[3], aqi: Math.min(300, currentAQIValue + 10), trend: "up" },
    { date: futureDates[4], aqi: Math.max(0, currentAQIValue - 8), trend: "down" },
  ];

  // health advice
  const healthAdvice = {
    general: {
      advice: "Air quality is acceptable. Consider reducing prolonged outdoor exertion if you experience symptoms.",
      activities: [
        "Normal outdoor activities are generally safe",
        "Stay hydrated",
        "Monitor air quality changes",
      ],
    },
    athlete: {
      advice: "Consider reducing intense outdoor training. Indoor workouts recommended during peak pollution hours.",
      activities: [
        "Schedule training in early morning",
        "Use indoor facilities when AQI > 50",
        "Hydrate frequently",
      ],
    },
    asthma: {
      advice: "High risk of triggering symptoms. Always carry rescue inhaler. Limit outdoor exposure.",
      activities: [
        "Avoid outdoor exercise",
        "Keep medications handy",
        "Use air purifiers indoors",
      ],
    },
    pregnant: {
      advice: "Limit exposure to outdoor pollution. Consider wearing N95 mask in high traffic areas.",
      activities: [
        "Choose indoor activities",
        "Avoid rush hour traffic",
        "Ventilate home when AQI is low",
      ],
    },
    child: {
      advice: "Children are more vulnerable to air pollution. Limit outdoor play time during poor air quality.",
      activities: [
        "Indoor play recommended",
        "Monitor for coughing/wheezing",
        "Ensure proper hydration",
      ],
    },
    elderly: {
      advice: "Increased risk of cardiovascular issues. Limit strenuous activities outdoors.",
      activities: [
        "Short, gentle walks only",
        "Avoid polluted areas",
        "Regular health check-ups",
      ],
    },
  };

  const currentAQI = getAQILevel(currentAQIValue);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        fontFamily: "Nunito, sans-serif",
        color: "#1a237e",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Enhanced Cloud Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 10% 20%, rgba(255,255,255,0.3) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(255,255,255,0.2) 0%, transparent 40%),
          radial-gradient(circle at 30% 70%, rgba(255,255,255,0.25) 0%, transparent 40%),
          radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 40%)
        `,
          animation: "cloudMove 25s infinite ease-in-out",
          pointerEvents: "none",
        }}
      />

      <style>
        {`
          @keyframes cloudMove {
            0% { 
              transform: translateX(0px) translateY(0px);
              opacity: 0.8;
            }
            25% { 
              transform: translateX(-20px) translateY(10px);
              opacity: 1;
            }
            50% { 
              transform: translateX(0px) translateY(20px);
              opacity: 0.9;
            }
            75% { 
              transform: translateX(20px) translateY(10px);
              opacity: 1;
            }
            100% { 
              transform: translateX(0px) translateY(0px);
              opacity: 0.8;
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .fade-in-element {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
          }
        `}
      </style>

      {/* City Header Section */}
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            background: "rgba(255, 255, 255, 0.8)",
            color: "#1a237e",
            border: "1px solid rgba(255,255,255,0.5)",
            padding: "12px 24px",
            borderRadius: "25px",
            cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
            fontWeight: "700",
            fontSize: "16px",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 1)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.8)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          ← Back to Map
        </button>

        <div className="fade-in-element" style={{ animationDelay: "0.2s" }}>
          <h1
            style={{
              margin: "0 0 20px 0",
              fontSize: "4rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #1a237e, #3949ab)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            {city.name}
          </h1>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1a237e",
              marginBottom: "50px",
              opacity: 0.9,
            }}
          >
            Air Quality Index: {currentAQIValue} {currentAQI.emoji}
          </div>
        </div>

        {/* Show forecast if available */}
{forecast && (
  <div className="fade-in-element" style={{ animationDelay: "0.3s" }}>
    <div style={{ 
      background: "rgba(255, 255, 255, 0.9)", 
      padding: "20px", 
      borderRadius: "15px", 
      margin: "20px 0",
      border: "2px solid #42a5f5",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
    }}>
      <strong style={{ fontSize: "1.2rem" }}>🌤️ Tomorrow's Forecast:</strong> 
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1a237e", margin: "10px 0" }}>
        AQI {Math.round(forecast.tomorrow_aqi)}
      </div>
      <em style={{ fontSize: "1rem", color: "#666" }}>💡 {forecast.tip}</em>
    </div>
  </div>
)}

        {/* Pollutant levels - using real data */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            maxWidth: "1200px",
            width: "95%",
            margin: "30px auto 0 auto",
            flexWrap: "nowrap",
            overflowX: "auto",
            padding: "10px 0",
          }}
        >
          {Object.entries(pollutantData).map(([pollutant, data], index) => (
            <div
              key={pollutant}
              className="fade-in-element"
              style={{
                animationDelay: `${0.4 + index * 0.1}s`,
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(255,255,255,0.6)",
                padding: "18px 12px",
                borderRadius: "15px",
                textAlign: "center",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                width: "130px",
                height: "110px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
                minWidth: "130px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  marginBottom: "6px",
                  color: "#1a237e",
                }}
              >
                {pollutant}
              </div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "800",
                  color: data.color,
                  marginBottom: "5px",
                }}
              >
                {data.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: data.color,
                  fontWeight: "600",
                  background: `${data.color}20`,
                  padding: "2px 6px",
                  borderRadius: "8px",
                  display: "inline-block",
                }}
              >
                {data.level}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Background Section */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          borderRadius: "50px 50px 0 0",
          padding: "60px 40px 80px 40px",
          marginTop: "-60px",
          position: "relative",
          zIndex: 3,
          minHeight: "50vh",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "50px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Forecast Section */}
          <div>
            <h2
              style={{
                margin: "0 0 40px 0",
                fontSize: "2.2rem",
                fontWeight: "800",
                color: "#1a237e",
                textAlign: "center",
              }}
            >
              📅 5-Day Air Quality Forecast
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "20px",
              }}
            >
              {forecastData.map((day, index) => {
                const aqiLevel = getAQILevel(day.aqi);
                const isToday = index === 0;

                return (
                  <div
                    key={index}
                    style={{
                      textAlign: "center",
                      padding: "25px 15px",
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      borderRadius: "20px",
                      border: "2px solid rgba(200, 200, 200, 0.3)",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        color: "#1a237e",
                        marginBottom: "12px",
                        fontSize: isToday ? "1.1rem" : "1rem",
                      }}
                    >
                      {isToday ? "Today" : formatDate(day.date)}
                    </div>
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: "800",
                        color: aqiLevel.color,
                        marginBottom: "10px",
                      }}
                    >
                    {Math.round(day.aqi)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: aqiLevel.color,
                        fontWeight: "600",
                        marginBottom: "10px",
                        background: `${aqiLevel.color}15`,
                        padding: "6px 12px",
                        borderRadius: "15px",
                        display: "inline-block",
                      }}
                    >
                      {aqiLevel.level} {aqiLevel.emoji}
                    </div>
                    <div style={{ fontSize: "1.3rem", marginTop: "8px" }}>
                      {getTrendIcon(day.trend)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Health Advice Section */}
          <div>
            <div
              style={{
                background: "linear-gradient(135deg, #42a5f5, #1976d2)",
                padding: "30px 25px",
                borderRadius: "25px",
                color: "white",
                marginBottom: "25px",
                boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                👤 Your Health Profile
              </h3>
              <select
                value={userProfile}
                onChange={(e) => setUserProfile(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "rgba(255,255,255,0.95)",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1a237e",
                  marginBottom: "25px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <option value="general">General Population</option>
                <option value="athlete">Athlete</option>
                <option value="asthma">Asthma</option>
                <option value="pregnant">Pregnant</option>
                <option value="child">Child</option>
                <option value="elderly">Elderly</option>
              </select>

              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "20px",
                  borderRadius: "15px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "1.1rem",
                  }}
                >
                  💡 Health Advice
                </h4>
                <p
                  style={{
                    lineHeight: "1.6",
                    marginBottom: "15px",
                    fontSize: "0.95rem",
                  }}
                >
                  {healthAdvice[userProfile].advice}
                </p>
              </div>
            </div>

            {/* Fun Fact Section */}
            <div
              style={{
                background: "linear-gradient(135deg, #29b6f6, #0288d1)",
                padding: "30px 25px",
                borderRadius: "25px",
                color: "white",
                boxShadow: "0 8px 25px rgba(2, 136, 209, 0.3)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 15px 0",
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                💡 Did You Know?
              </h3>
              <p
                style={{
                  lineHeight: "1.6",
                  fontStyle: "italic",
                  margin: 0,
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                "Indoor plants like spider plants and peace lilies can naturally
                filter air pollutants and improve your home's air quality by up
                to 25%."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetailsPage;