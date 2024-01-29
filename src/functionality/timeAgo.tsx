interface TimeAgoItem {
  createdAt: string; // Assuming createdAt is a string, adjust if it's a different type
}

function getTimeAgo(item: TimeAgoItem): string {
  const createdDate = new Date(item.createdAt).getTime();
  const currentDate = new Date().getTime();

  // Reset time to check only the date part for the 'Yesterday' condition
  const createdReset = new Date(item.createdAt);
  createdReset.setHours(0, 0, 0, 0);
  const currentReset = new Date();
  currentReset.setHours(0, 0, 0, 0);

  const timeDifferenceInMillis = currentDate - createdDate;
  const dateDifferenceInMillis = currentReset.getTime() - createdReset.getTime();
  const timeDifferenceInDays = Math.floor(
    dateDifferenceInMillis / (24 * 60 * 60 * 1000)
  );

  if (timeDifferenceInDays === 1) {
    return "Yesterday";
  }

  const timeDifferenceInSeconds = Math.floor(timeDifferenceInMillis / 1000);
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
  const timeDifferenceInMonths = Math.floor(timeDifferenceInDays / 30);
  const timeDifferenceInYears = Math.floor(timeDifferenceInDays / 365);

  if (timeDifferenceInSeconds < 60) {
    return "Just now";
  } else if (timeDifferenceInMinutes < 60) {
    return `${timeDifferenceInMinutes} minutes ago`;
  } else if (timeDifferenceInHours < 24) {
    return `${timeDifferenceInHours} hours ago`;
  } else if (timeDifferenceInDays < 30) {
    return `${timeDifferenceInDays} days ago`;
  } else if (timeDifferenceInMonths < 12) {
    return `${timeDifferenceInMonths} months ago`;
  } else {
    return `${timeDifferenceInYears} years ago`;
  }
}

export default getTimeAgo;

