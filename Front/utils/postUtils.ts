export const markPostAsSeen = (postId: number) => {
	const seenPosts: number[] = JSON.parse(
		localStorage.getItem("seenPosts") || "[]"
	);
	if (!seenPosts.includes(postId)) {
		seenPosts.push(postId);
		localStorage.setItem("seenPosts", JSON.stringify(seenPosts));
	}
};

export const isPostSeen = (postId: number): boolean => {
	const seenPosts: number[] = JSON.parse(
		localStorage.getItem("seenPosts") || "[]"
	);
	return seenPosts.includes(postId);
};
