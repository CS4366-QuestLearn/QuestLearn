import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopNavigationBarService } from 'src/app/components/top-navigation-bar/top-navigation-bar.service';
import { AuthService } from 'src/app/utils/auth.service';
import { QuestlearnService } from 'src/app/utils/questlearn.service';
import { AvatarService } from './avatar.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  public user: gapi.auth2.GoogleUser;
  formGroup: FormGroup;

  inventory = {
    animal_items: [],
    head_items: [],
    shirt_items: [],
    pant_items: [],
    accessory_items: [],
  };

  items: any[] = [];

  loading = true;
  isSaving = false;

  constructor(
    private formBuilder: FormBuilder,
    private avatarService: AvatarService,
    private questlearnService: QuestlearnService,
    private authService: AuthService,
    private topNavigationBarService: TopNavigationBarService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.currentUserValue;
    this.items = await this.avatarService.getShopItems();
    this.items.forEach(item => {
      if (this.questlearnService.questlearnUserValue.inventory[item.type + '_ids'].includes(item._id)) {
        this.inventory[item.type + '_items'].push(item);
      }
    });

    this.createForm(this.questlearnService.questlearnUserValue.equipped);
    this.loading = false;
  }

  createForm(equipped) {
    this.formGroup = this.formBuilder.group({
      'animal': [this.inventory.animal_items.findIndex(x => x._id == equipped.animal_id), [Validators.required]],
      'head': [this.inventory.head_items.findIndex(x => x._id == equipped.head_id), [Validators.required]],
      'shirt': [this.inventory.shirt_items.findIndex(x => x._id == equipped.shirt_id), [Validators.required]],
      'pant': [this.inventory.pant_items.findIndex(x => x._id == equipped.pant_id), [Validators.required]],
      'accessory': [this.inventory.accessory_items.findIndex(x => x._id == equipped.accessory_id), [Validators.required]],
    });
  }

  async onSubmit(formData) {
    let saveData: any = {
      animal_id: this.inventory.animal_items[formData.animal]._id,
      head_id: this.inventory.head_items[formData.head]._id,
      shirt_id: this.inventory.shirt_items[formData.shirt]._id,
      pant_id: this.inventory.pant_items[formData.pant]._id,
      accessory_id: this.inventory.accessory_items[formData.accessory]._id,
    };

    this.isSaving = true;
    const res: any = await this.avatarService.updateEquippedItems(saveData, this.user);
    this.isSaving = false;
    this.topNavigationBarService.updateAvatarUrl(res.avatar_url);
  }

}
