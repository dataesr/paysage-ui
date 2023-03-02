export function getMarkersInfo(structures) {
  return structures.map((element) => {
    const { coordinates } = element.currentLocalisation.geometry;
    const markersCoordinates = [...coordinates];
    const reversed = markersCoordinates.reverse();
    return ({
      latLng: reversed,
      address: `${element.displayName}
           ${element.currentLocalisation?.address},
           ${element.currentLocalisation?.postalCode},
           ${element.currentLocalisation?.locality}`,
    });
  });
}

export function getMarkers(data, inverse = false) {
  const relatedKey = inverse ? 'resource' : 'relatedObject';
  if (!data?.length) return [];
  const relatedStructures = data
    .filter((element) => (element[relatedKey]?.collection === 'structures'))
    .filter((element) => element[relatedKey]?.currentLocalisation?.geometry?.coordinates)
    .map((element) => element[[relatedKey]]);
  const relatedMarkers = getMarkersInfo(relatedStructures);
  const associatedStructures = data
    .map((element) => element.otherAssociatedObjects)
    .filter((element) => (element?.length > 0))
    .flat()
    .filter((element) => element.collection === 'structures')
    .filter((element) => element?.currentLocalisation?.geometry?.coordinates);
  const associatedStructuresMarkers = getMarkersInfo(associatedStructures);
  return [...relatedMarkers, ...associatedStructuresMarkers];
}
