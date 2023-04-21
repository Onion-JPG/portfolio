import cassiopeia
import customtkinter
import os
from PIL import Image

# parsing class for getting info from the game
class parsing:
    # a method that places the champion info into the correct location in the frame
    # could probably be done via passing current_match or each team instead of summoner
    # but this worked and I dont see a reason to change it at the moment
    #
    # @param frame the fram we are puting the info into
    # @param summoner the summoner that was searched for
    def getChamps(frame, summoner):
        # row is set to 6 for formating, 6 rows from the top for the left most col
        row = 6
        # num is the count of the player, we use this for formating
        num = 0
        # for every participant on the blue team
        for participant in summoner.current_match.blue_team.participants:
            if (num < 2) : 
                parseChamp(frame, participant, 0, row)
            else : 
                if (num == 2) : row = 2
                parseChamp(frame, participant, 1, row)
            # move down 8 spaces for formating
            row += 8
            num += 1

        # row is reset to 2 for formating
        row = 2
        # num is reset to 0 for formating
        num = 0
        #for every participant on the red side
        for participant in summoner.current_match.red_team.participants:
            if (num < 3) :
                parseChamp(frame, participant, 3, row)
            else :
                if (num == 3) : row = 6
                parseChamp(frame, participant, 4, row)
            # move down 8 spaces for formating
            row += 8
            num += 1

# a method that takes the information of the player and actually places the info into the frame
#
# @param frame the frame getting the info
# @param participant the actual player that we want to get the information about
# @param col the column that the info is getting placed into
# @param row the first row that the info is getting placed into
def parseChamp(frame, participant, col, row):
    # defining the path to the folder that has all the champion icons, this can
    # be changed to just be a API call but I found this to be easier
    image_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "champion")

    # using customtkinter to add the participants name
    frame.label = customtkinter.CTkLabel(master=frame, text=participant.summoner.name, font=("Roboto", 20))
    frame.label.grid(row=row, column=col)

    # using customtkinter to add the participants champion
    frame.label = customtkinter.CTkLabel(master=frame, text=cassiopeia.get_champion(key=participant.champion, region="NA").name, font=("Roboto", 18))
    frame.label.grid(row=row+1, column=col)

    # using customtkinter to add the champion icon
    champ_image = customtkinter.CTkImage(Image.open(os.path.join(image_path, participant.champion.key + ".png")), size=(25, 25))
    frame.label = customtkinter.CTkLabel(master=frame, image=champ_image, text=None)
    frame.label.grid(row=row+2, column=col)

    # using customtkinter to add all of the champion's spells
    spellCount = 0
    for spell in cassiopeia.get_champion(key=participant.champion, region="NA").spells :
        frame.label = customtkinter.CTkLabel(master=frame, text=spell.name, font=("Roboto", 15))
        frame.label.grid(row=row+3+spellCount, column=col)
        spellCount += 1
    